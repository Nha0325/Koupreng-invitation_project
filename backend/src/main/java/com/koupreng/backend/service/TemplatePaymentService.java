package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.PaymentProperties;
import com.koupreng.backend.dto.payment.ConfirmTemplatePaymentRequest;
import com.koupreng.backend.dto.payment.CreateTemplateOrderRequest;
import com.koupreng.backend.dto.payment.CreateTemplateOrderResponse;
import com.koupreng.backend.dto.payment.PaymentConfirmResponse;
import com.koupreng.backend.dto.payment.TelegramDetectPaymentRequest;
import com.koupreng.backend.dto.payment.TemplateAccessCheckResponse;
import com.koupreng.backend.dto.payment.TemplateOrderResponse;
import com.koupreng.backend.dto.payment.UserTemplateAccessResponse;
import com.koupreng.backend.entity.payment.TemplateOrder;
import com.koupreng.backend.entity.payment.UserTemplateAccess;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.enums.PaymentStatus;
import com.koupreng.backend.repository.TemplateOrderRepository;
import com.koupreng.backend.repository.UserTemplateAccessRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TemplatePaymentService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Phnom_Penh");
    private static final DateTimeFormatter ORDER_DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd")
            .withZone(BUSINESS_ZONE);
    private static final Pattern ORDER_CODE_PATTERN = Pattern.compile("\\b(EVT[0-9]{9,10})\\b");
    private static final List<Pattern> AMOUNT_PATTERNS = List.of(
            Pattern.compile("(?i)USD\\s*([0-9]+(?:\\.[0-9]{1,2})?)"),
            Pattern.compile("\\$\\s*([0-9]+(?:\\.[0-9]{1,2})?)"),
            Pattern.compile("(?i)amount\\s*[:=]?\\s*USD?\\s*([0-9]+(?:\\.[0-9]{1,2})?)"),
            Pattern.compile("(?i)amount\\s*[:=]?\\s*([0-9]+(?:\\.[0-9]{1,2})?)")
    );
    private static final Collection<PaymentStatus> CONFIRMABLE_STATUSES = List.of(
            PaymentStatus.PENDING,
            PaymentStatus.WAITING_MANUAL_CONFIRMATION,
            PaymentStatus.PAID_PENDING_REVIEW
    );
    private static final Collection<PaymentStatus> PENDING_ADMIN_STATUSES = List.of(
            PaymentStatus.PENDING,
            PaymentStatus.WAITING_MANUAL_CONFIRMATION,
            PaymentStatus.PAID_PENDING_REVIEW
    );

    private final TemplateOrderRepository templateOrderRepository;
    private final UserTemplateAccessRepository accessRepository;
    private final CurrentUserService currentUserService;
    private final PaymentProperties paymentProperties;
    private final SecureRandom random = new SecureRandom();

    public TemplatePaymentService(
            TemplateOrderRepository templateOrderRepository,
            UserTemplateAccessRepository accessRepository,
            CurrentUserService currentUserService,
            PaymentProperties paymentProperties
    ) {
        this.templateOrderRepository = templateOrderRepository;
        this.accessRepository = accessRepository;
        this.currentUserService = currentUserService;
        this.paymentProperties = paymentProperties;
    }

    @Transactional
    public CreateTemplateOrderResponse createOrder(Authentication authentication, CreateTemplateOrderRequest request) {
        AppUser user = currentUserService.currentUser(authentication);
        Long templateId = requirePositiveTemplateId(request.getTemplateId());
        BigDecimal amount = money(request.getAmount());
        String templateName = requireText(request.getTemplateName(), "Template name is required");
        String packageName = requireText(request.getPackageName(), "Package name is required");

        if (accessRepository.existsByUserIdAndTemplateIdAndActiveTrue(user.getId(), templateId)) {
            throw new ApiException(HttpStatus.CONFLICT, "Template already unlocked");
        }

        TemplateOrder order = new TemplateOrder();
        order.setOrderCode(uniqueOrderCode());
        order.setUser(user);
        order.setTemplateId(templateId);
        order.setTemplateName(templateName);
        order.setPackageName(packageName);
        order.setAmount(amount);
        order.setCurrency("USD");
        order.setPaymentLink(paymentProperties.getAba().getStaticLink());
        order.setPaymentNote(order.getOrderCode());
        order.setPaymentProvider(TemplateOrder.PROVIDER_ABA_PAYWAY_STATIC);
        order.setStatus(PaymentStatus.PENDING);
        order.setExpiresAt(Instant.now().plusSeconds(paymentProperties.getOrderExpiryMinutes() * 60));

        TemplateOrder saved = templateOrderRepository.save(order);
        return CreateTemplateOrderResponse.from(
                saved,
                "Please copy this Order Code into the ABA payment note before paying."
        );
    }

    @Transactional(readOnly = true)
    public TemplateOrderResponse getOrderByCode(Authentication authentication, String orderCode) {
        AppUser user = currentUserService.currentUser(authentication);
        TemplateOrder order = requireOrder(orderCode);
        if (!isOwnerOrAdmin(order, user)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have access to this payment order");
        }
        return TemplateOrderResponse.from(markExpiredInMemory(order));
    }

    @Transactional
    public PaymentConfirmResponse confirmManualPayment(ConfirmTemplatePaymentRequest request, String source) {
        TemplateOrder order = requireOrder(request.getOrderCode());
        BigDecimal amount = money(request.getAmount());
        String confirmedBy = requireText(request.getConfirmedBy(), "Confirmed by is required");
        validateConfirmable(order, amount);
        markPaid(order, amount, source, confirmedBy, null);
        return PaymentConfirmResponse.builder()
                .message("Payment confirmed. Template unlocked.")
                .orderCode(order.getOrderCode())
                .status(order.getStatus())
                .build();
    }

    @Transactional
    public PaymentConfirmResponse detectPaymentFromTelegram(TelegramDetectPaymentRequest request) {
        String rawMessage = requireText(request.getRawMessage(), "Raw message is required");
        String detectedBy = requireText(request.getDetectedBy(), "Detected by is required");
        String orderCode = detectOrderCode(rawMessage);
        BigDecimal amount = detectAmount(rawMessage);
        TemplateOrder order = requireOrder(orderCode);
        validateConfirmable(order, amount);

        if (paymentProperties.isAutoConfirmTelegramDetected()) {
            markPaid(order, amount, "TELEGRAM_DETECTED", detectedBy, rawMessage);
            return PaymentConfirmResponse.builder()
                    .message("Payment detected and confirmed. Template unlocked.")
                    .orderCode(order.getOrderCode())
                    .status(order.getStatus())
                    .build();
        }

        order.setStatus(PaymentStatus.PAID_PENDING_REVIEW);
        order.setPaidAmount(amount);
        order.setConfirmSource("TELEGRAM_DETECTED_PENDING_REVIEW");
        order.setConfirmedBy(detectedBy);
        order.setConfirmedAt(Instant.now());
        order.setRawTelegramMessage(rawMessage);
        templateOrderRepository.save(order);
        return PaymentConfirmResponse.builder()
                .message("Payment detected and waiting for admin review.")
                .orderCode(order.getOrderCode())
                .status(order.getStatus())
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserTemplateAccessResponse> getPaidTemplatesByCurrentUser(Authentication authentication) {
        AppUser user = currentUserService.currentUser(authentication);
        return accessRepository.findByUserIdAndActiveTrue(user.getId()).stream()
                .map(UserTemplateAccessResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TemplateAccessCheckResponse hasTemplateAccess(Authentication authentication, Long templateId) {
        AppUser user = currentUserService.currentUser(authentication);
        Long validTemplateId = requirePositiveTemplateId(templateId);
        boolean hasAccess = accessRepository.existsByUserIdAndTemplateIdAndActiveTrue(user.getId(), validTemplateId);
        return TemplateAccessCheckResponse.builder()
                .templateId(validTemplateId)
                .hasAccess(hasAccess)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TemplateOrderResponse> listPendingForAdmin() {
        return templateOrderRepository.findByStatusInOrderByCreatedAtDesc(PENDING_ADMIN_STATUSES).stream()
                .map(TemplateOrderResponse::from)
                .toList();
    }

    @Transactional
    public void expireOldOrdersIfNeeded() {
        List<TemplateOrder> expired = templateOrderRepository.findByStatusAndExpiresAtBefore(
                PaymentStatus.PENDING,
                Instant.now()
        );
        for (TemplateOrder order : expired) {
            order.setStatus(PaymentStatus.EXPIRED);
        }
        templateOrderRepository.saveAll(expired);
    }

    private void markPaid(
            TemplateOrder order,
            BigDecimal amount,
            String source,
            String confirmedBy,
            String rawTelegramMessage
    ) {
        Instant now = Instant.now();
        order.setStatus(PaymentStatus.PAID);
        order.setPaidAmount(amount);
        order.setConfirmSource(source);
        order.setConfirmedBy(confirmedBy);
        order.setConfirmedAt(now);
        order.setPaidAt(now);
        order.setRawTelegramMessage(rawTelegramMessage);
        templateOrderRepository.save(order);
        unlockTemplate(order);
    }

    private void unlockTemplate(TemplateOrder order) {
        Long userId = order.getUser().getId();
        if (accessRepository.existsByUserIdAndTemplateIdAndOrderIdAndActiveTrue(
                userId,
                order.getTemplateId(),
                order.getId()
        )) {
            return;
        }

        UserTemplateAccess access = new UserTemplateAccess();
        access.setUser(order.getUser());
        access.setTemplateId(order.getTemplateId());
        access.setOrder(order);
        access.setAccessType(UserTemplateAccess.ACCESS_TYPE_PURCHASED);
        access.setActive(true);
        accessRepository.save(access);
    }

    private void validateConfirmable(TemplateOrder order, BigDecimal paidAmount) {
        markExpiredIfNeeded(order);
        if (order.getStatus() == PaymentStatus.PAID) {
            throw new ApiException(HttpStatus.CONFLICT, "Order already paid");
        }
        if (order.getStatus() == PaymentStatus.EXPIRED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Order expired");
        }
        if (!CONFIRMABLE_STATUSES.contains(order.getStatus())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid order status");
        }
        if (order.getAmount().compareTo(paidAmount) != 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Amount mismatch");
        }
    }

    private TemplateOrder markExpiredIfNeeded(TemplateOrder order) {
        if (order.getStatus() == PaymentStatus.PENDING
                && order.getExpiresAt() != null
                && Instant.now().isAfter(order.getExpiresAt())) {
            order.setStatus(PaymentStatus.EXPIRED);
            templateOrderRepository.save(order);
        }
        return order;
    }

    private TemplateOrder markExpiredInMemory(TemplateOrder order) {
        if (order.getStatus() == PaymentStatus.PENDING
                && order.getExpiresAt() != null
                && Instant.now().isAfter(order.getExpiresAt())) {
            order.setStatus(PaymentStatus.EXPIRED);
        }
        return order;
    }

    private TemplateOrder requireOrder(String orderCode) {
        String normalized = requireText(orderCode, "Order code is required").toUpperCase(Locale.ROOT);
        return templateOrderRepository.findByOrderCode(normalized)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    private boolean isOwnerOrAdmin(TemplateOrder order, AppUser user) {
        return user.getRole() == Role.ADMIN
                || (order.getUser() != null && order.getUser().getId().equals(user.getId()));
    }

    private String detectOrderCode(String rawMessage) {
        Matcher matcher = ORDER_CODE_PATTERN.matcher(rawMessage.toUpperCase(Locale.ROOT));
        if (!matcher.find()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Order code not found in Telegram message");
        }
        return matcher.group(1);
    }

    private BigDecimal detectAmount(String rawMessage) {
        for (Pattern pattern : AMOUNT_PATTERNS) {
            Matcher matcher = pattern.matcher(rawMessage);
            if (matcher.find()) {
                return money(new BigDecimal(matcher.group(1)));
            }
        }
        throw new ApiException(HttpStatus.BAD_REQUEST, "Amount not found in Telegram message");
    }

    private String uniqueOrderCode() {
        String date = ORDER_DATE_FORMAT.format(Instant.now());
        for (int attempt = 0; attempt < 80; attempt++) {
            int randomSuffix = attempt < 40 ? random.nextInt(900) + 100 : random.nextInt(9000) + 1000;
            String candidate = "EVT" + date + randomSuffix;
            if (!templateOrderRepository.existsByOrderCode(candidate)) {
                return candidate;
            }
        }
        throw new ApiException(HttpStatus.CONFLICT, "Could not generate unique order code");
    }

    private Long requirePositiveTemplateId(Long templateId) {
        if (templateId == null || templateId <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Template ID is required");
        }
        return templateId;
    }

    private BigDecimal money(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid amount");
        }
        try {
            return amount.setScale(2, RoundingMode.UNNECESSARY);
        } catch (ArithmeticException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Amount must have at most two decimal places");
        }
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }
}
