package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.PaymentProperties;
import com.koupreng.backend.dto.payment.ConfirmTemplatePaymentRequest;
import com.koupreng.backend.dto.payment.CreateTemplateOrderRequest;
import com.koupreng.backend.dto.payment.CreateTemplateOrderResponse;
import com.koupreng.backend.dto.payment.PaymentConfirmResponse;
import com.koupreng.backend.dto.payment.TelegramDetectPaymentRequest;
import com.koupreng.backend.entity.payment.TemplateOrder;
import com.koupreng.backend.entity.payment.UserTemplateAccess;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.enums.PaymentStatus;
import com.koupreng.backend.repository.TemplateOrderRepository;
import com.koupreng.backend.repository.UserTemplateAccessRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TemplatePaymentServiceTests {

    @Test
    void createOrderCreatesPendingStaticAbaOrderForAuthenticatedUser() {
        Fixture fixture = fixture();

        CreateTemplateOrderResponse response = fixture.service.createOrder(fixture.authentication, createRequest());

        assertTrue(response.getOrderCode().matches("EVT\\d{9,10}"));
        assertEquals(10L, response.getTemplateId());
        assertEquals(new BigDecimal("5.00"), response.getAmount());
        assertEquals("https://link.payway.com.kh/ABAPAY66444229Q", response.getPaymentLink());
        assertEquals(response.getOrderCode(), response.getPaymentNote());
        assertEquals(PaymentStatus.PENDING, response.getStatus());
        assertNotNull(response.getExpiresAt());
    }

    @Test
    void createOrderRejectsAlreadyUnlockedTemplate() {
        Fixture fixture = fixture();
        when(fixture.accessRepository.existsByUserIdAndTemplateIdAndActiveTrue(1L, 10L)).thenReturn(true);

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.createOrder(fixture.authentication, createRequest())
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
    }

    @Test
    void confirmManualPaymentMarksPaidAndUnlocksTemplate() {
        Fixture fixture = fixture();
        TemplateOrder order = order(fixture.owner, PaymentStatus.PENDING, new BigDecimal("5.00"));
        when(fixture.orderRepository.findByOrderCode("EVT260520001")).thenReturn(Optional.of(order));

        PaymentConfirmResponse response = fixture.service.confirmManualPayment(confirmRequest("EVT260520001", "5.00"), "MANUAL_ADMIN");

        assertEquals(PaymentStatus.PAID, response.getStatus());
        assertEquals(new BigDecimal("5.00"), order.getPaidAmount());
        assertNotNull(order.getPaidAt());
        verify(fixture.accessRepository).save(any(UserTemplateAccess.class));
    }

    @Test
    void confirmManualPaymentRejectsAmountMismatch() {
        Fixture fixture = fixture();
        TemplateOrder order = order(fixture.owner, PaymentStatus.PENDING, new BigDecimal("5.00"));
        when(fixture.orderRepository.findByOrderCode("EVT260520001")).thenReturn(Optional.of(order));

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.confirmManualPayment(confirmRequest("EVT260520001", "4.00"), "MANUAL_ADMIN")
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Amount mismatch", exception.getMessage());
        verify(fixture.accessRepository, never()).save(any(UserTemplateAccess.class));
    }

    @Test
    void confirmManualPaymentRejectsAlreadyPaidOrder() {
        Fixture fixture = fixture();
        TemplateOrder order = order(fixture.owner, PaymentStatus.PAID, new BigDecimal("5.00"));
        when(fixture.orderRepository.findByOrderCode("EVT260520001")).thenReturn(Optional.of(order));

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.confirmManualPayment(confirmRequest("EVT260520001", "5.00"), "MANUAL_ADMIN")
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
    }

    @Test
    void confirmManualPaymentRejectsExpiredOrder() {
        Fixture fixture = fixture();
        TemplateOrder order = order(fixture.owner, PaymentStatus.PENDING, new BigDecimal("5.00"));
        order.setExpiresAt(Instant.now().minusSeconds(10));
        when(fixture.orderRepository.findByOrderCode("EVT260520001")).thenReturn(Optional.of(order));

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.confirmManualPayment(confirmRequest("EVT260520001", "5.00"), "MANUAL_ADMIN")
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals(PaymentStatus.EXPIRED, order.getStatus());
    }

    @Test
    void telegramDetectMarksPendingReviewWithoutUnlockWhenAutoConfirmDisabled() {
        Fixture fixture = fixture();
        TemplateOrder order = order(fixture.owner, PaymentStatus.PENDING, new BigDecimal("5.00"));
        when(fixture.orderRepository.findByOrderCode("EVT260520001")).thenReturn(Optional.of(order));
        TelegramDetectPaymentRequest request = new TelegramDetectPaymentRequest();
        request.setRawMessage("ABA payment received USD 5.00 Note: EVT260520001");
        request.setDetectedBy("telegram_admin");

        PaymentConfirmResponse response = fixture.service.detectPaymentFromTelegram(request);

        assertEquals(PaymentStatus.PAID_PENDING_REVIEW, response.getStatus());
        assertEquals(new BigDecimal("5.00"), order.getPaidAmount());
        verify(fixture.accessRepository, never()).save(any(UserTemplateAccess.class));
    }

    @Test
    void telegramDetectRejectsMissingOrderCode() {
        Fixture fixture = fixture();
        TelegramDetectPaymentRequest request = new TelegramDetectPaymentRequest();
        request.setRawMessage("ABA payment received USD 5.00 without note");
        request.setDetectedBy("telegram_admin");

        ApiException exception = assertThrows(ApiException.class, () -> fixture.service.detectPaymentFromTelegram(request));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Order code not found in Telegram message", exception.getMessage());
    }

    @Test
    void nonOwnerCannotViewOrder() {
        Fixture fixture = fixture();
        TemplateOrder order = order(fixture.owner, PaymentStatus.PENDING, new BigDecimal("5.00"));
        when(fixture.orderRepository.findByOrderCode("EVT260520001")).thenReturn(Optional.of(order));
        AppUser other = user(2L, Role.USER);
        when(fixture.currentUserService.currentUser(fixture.authentication)).thenReturn(other);

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.getOrderByCode(fixture.authentication, "EVT260520001")
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
    }

    private Fixture fixture() {
        TemplateOrderRepository orderRepository = mock(TemplateOrderRepository.class);
        UserTemplateAccessRepository accessRepository = mock(UserTemplateAccessRepository.class);
        CurrentUserService currentUserService = mock(CurrentUserService.class);
        PaymentProperties paymentProperties = new PaymentProperties();
        Authentication authentication = mock(Authentication.class);
        AppUser owner = user(1L, Role.USER);
        TemplatePaymentService service = new TemplatePaymentService(
                orderRepository,
                accessRepository,
                currentUserService,
                paymentProperties
        );

        when(currentUserService.currentUser(authentication)).thenReturn(owner);
        when(orderRepository.existsByOrderCode(any())).thenReturn(false);
        when(orderRepository.save(any(TemplateOrder.class))).thenAnswer(invocation -> {
            TemplateOrder order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(99L);
            }
            return order;
        });
        when(accessRepository.existsByUserIdAndTemplateIdAndOrderIdAndActiveTrue(any(), any(), any()))
                .thenReturn(false);

        return new Fixture(service, orderRepository, accessRepository, currentUserService, authentication, owner);
    }

    private CreateTemplateOrderRequest createRequest() {
        CreateTemplateOrderRequest request = new CreateTemplateOrderRequest();
        request.setTemplateId(10L);
        request.setTemplateName("Khmer Wedding Gold");
        request.setPackageName("Premium");
        request.setAmount(new BigDecimal("5.00"));
        return request;
    }

    private ConfirmTemplatePaymentRequest confirmRequest(String orderCode, String amount) {
        ConfirmTemplatePaymentRequest request = new ConfirmTemplatePaymentRequest();
        request.setOrderCode(orderCode);
        request.setAmount(new BigDecimal(amount));
        request.setConfirmedBy("admin");
        return request;
    }

    private TemplateOrder order(AppUser user, PaymentStatus status, BigDecimal amount) {
        TemplateOrder order = new TemplateOrder();
        order.setId(99L);
        order.setOrderCode("EVT260520001");
        order.setUser(user);
        order.setTemplateId(10L);
        order.setTemplateName("Khmer Wedding Gold");
        order.setPackageName("Premium");
        order.setAmount(amount);
        order.setCurrency("USD");
        order.setPaymentLink("https://link.payway.com.kh/ABAPAY66444229Q");
        order.setPaymentNote("EVT260520001");
        order.setStatus(status);
        order.setExpiresAt(Instant.now().plusSeconds(3600));
        return order;
    }

    private AppUser user(Long id, Role role) {
        AppUser user = new AppUser();
        user.setId(id);
        user.setFullName("User " + id);
        user.setRole(role);
        return user;
    }

    private record Fixture(
            TemplatePaymentService service,
            TemplateOrderRepository orderRepository,
            UserTemplateAccessRepository accessRepository,
            CurrentUserService currentUserService,
            Authentication authentication,
            AppUser owner
    ) {
    }
}
