package com.koupreng.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.PaymentProperties;
import com.koupreng.backend.dto.payment.CreateTemplatePaymentRequest;
import com.koupreng.backend.dto.payment.CreateTemplatePaymentResponse;
import com.koupreng.backend.dto.payment.PayWayCallbackResponse;
import com.koupreng.backend.entity.payment.TemplatePaymentOrder;
import com.koupreng.backend.entity.payment.UserTemplateAccess;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.enums.PaymentStatus;
import com.koupreng.backend.repository.InvitationTemplateRepository;
import com.koupreng.backend.repository.TemplatePaymentOrderRepository;
import com.koupreng.backend.repository.UserTemplateAccessRepository;
import com.koupreng.backend.service.payment.AbaPayWayCheckout;
import com.koupreng.backend.service.payment.AbaPayWayService;
import com.koupreng.backend.service.payment.PayWayTransactionVerification;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
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
    void createPaywayCheckoutCreatesSignedCheckoutForAuthenticatedUser() {
        Fixture fixture = fixture();
        when(fixture.abaPayWayService.createCheckout(any(), any(), any()))
                .thenReturn(new AbaPayWayCheckout(
                        "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase",
                        Map.of("tran_id", "PW26052612000011", "hash", "signed"),
                        "{\"tran_id\":\"PW26052612000011\"}",
                        "{\"mode\":\"SIGNED_FORM\"}"
                ));

        CreateTemplatePaymentResponse response = fixture.service.createPaywayCheckout(
                fixture.authentication,
                createRequest()
        );

        assertTrue(response.getOrderCode().matches("EVT\\d{9,10}"));
        assertNotNull(response.getTransactionId());
        assertEquals(10L, response.getTemplateId());
        assertEquals(new BigDecimal("5.00"), response.getAmount());
        assertEquals(PaymentStatus.CHECKOUT_CREATED, response.getStatus());
        assertEquals("signed", response.getCheckoutFormFields().get("hash"));
    }

    @Test
    void createPaywayCheckoutRejectsAlreadyUnlockedTemplate() {
        Fixture fixture = fixture();
        when(fixture.accessRepository.existsByUserIdAndTemplateIdAndActiveTrue(1L, 10L)).thenReturn(true);

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.createPaywayCheckout(fixture.authentication, createRequest())
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
    }

    @Test
    void callbackVerifiesWithPayWayBeforeMarkingPaidAndUnlockingTemplate() {
        Fixture fixture = fixture();
        TemplatePaymentOrder order = order(fixture.owner, PaymentStatus.CHECKOUT_CREATED, new BigDecimal("5.00"));
        Map<String, Object> payload = Map.of("tran_id", order.getTransactionId(), "status", "0", "apv", "123456");
        when(fixture.orderRepository.findByTransactionId(order.getTransactionId())).thenReturn(Optional.of(order));
        when(fixture.abaPayWayService.verifyCallbackSignature(payload, "sig")).thenReturn(true);
        when(fixture.abaPayWayService.checkTransaction(order.getTransactionId()))
                .thenReturn(new PayWayTransactionVerification(
                        true,
                        PaymentStatus.PAID,
                        new BigDecimal("5.00"),
                        "USD",
                        "APPROVED",
                        order.getTransactionId(),
                        "{\"data\":{\"payment_status\":\"APPROVED\"}}"
                ));

        PayWayCallbackResponse response = fixture.service.handlePaywayCallback(payload, "sig");

        assertEquals(PaymentStatus.PAID, response.getStatus());
        assertEquals(new BigDecimal("5.00"), order.getPaidAmount());
        assertNotNull(order.getPaidAt());
        verify(fixture.accessRepository).save(any(UserTemplateAccess.class));
    }

    @Test
    void callbackRejectsInvalidSignatureWithoutUnlockingTemplate() {
        Fixture fixture = fixture();
        TemplatePaymentOrder order = order(fixture.owner, PaymentStatus.CHECKOUT_CREATED, new BigDecimal("5.00"));
        Map<String, Object> payload = Map.of("tran_id", order.getTransactionId(), "status", "0");
        when(fixture.orderRepository.findByTransactionId(order.getTransactionId())).thenReturn(Optional.of(order));
        when(fixture.abaPayWayService.verifyCallbackSignature(payload, "bad")).thenReturn(false);

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.handlePaywayCallback(payload, "bad")
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
        assertEquals(PaymentStatus.CHECKOUT_CREATED, order.getStatus());
        verify(fixture.accessRepository, never()).save(any(UserTemplateAccess.class));
    }

    @Test
    void callbackRejectsAmountMismatch() {
        Fixture fixture = fixture();
        TemplatePaymentOrder order = order(fixture.owner, PaymentStatus.CHECKOUT_CREATED, new BigDecimal("5.00"));
        Map<String, Object> payload = Map.of("tran_id", order.getTransactionId(), "status", "0");
        when(fixture.orderRepository.findByTransactionId(order.getTransactionId())).thenReturn(Optional.of(order));
        when(fixture.abaPayWayService.verifyCallbackSignature(payload, "sig")).thenReturn(true);
        when(fixture.abaPayWayService.checkTransaction(order.getTransactionId()))
                .thenReturn(new PayWayTransactionVerification(
                        true,
                        PaymentStatus.PAID,
                        new BigDecimal("4.00"),
                        "USD",
                        "APPROVED",
                        order.getTransactionId(),
                        "{}"
                ));

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.handlePaywayCallback(payload, "sig")
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertEquals("Amount mismatch", exception.getMessage());
        assertEquals(PaymentStatus.REJECTED, order.getStatus());
        verify(fixture.accessRepository, never()).save(any(UserTemplateAccess.class));
    }

    @Test
    void nonOwnerCannotViewOrder() {
        Fixture fixture = fixture();
        TemplatePaymentOrder order = order(fixture.owner, PaymentStatus.CHECKOUT_CREATED, new BigDecimal("5.00"));
        when(fixture.orderRepository.findByOrderCode("EVT260526001")).thenReturn(Optional.of(order));
        AppUser other = user(2L, Role.USER);
        when(fixture.currentUserService.currentUser(fixture.authentication)).thenReturn(other);

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.getOrderStatus(fixture.authentication, "EVT260526001")
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
    }

    private Fixture fixture() {
        TemplatePaymentOrderRepository orderRepository = mock(TemplatePaymentOrderRepository.class);
        UserTemplateAccessRepository accessRepository = mock(UserTemplateAccessRepository.class);
        InvitationTemplateRepository templateRepository = mock(InvitationTemplateRepository.class);
        CurrentUserService currentUserService = mock(CurrentUserService.class);
        AbaPayWayService abaPayWayService = mock(AbaPayWayService.class);
        PaymentProperties paymentProperties = new PaymentProperties();
        Authentication authentication = mock(Authentication.class);
        AppUser owner = user(1L, Role.USER);
        TemplatePaymentService service = new TemplatePaymentService(
                orderRepository,
                accessRepository,
                templateRepository,
                currentUserService,
                paymentProperties,
                abaPayWayService,
                new ObjectMapper()
        );

        when(currentUserService.currentUser(authentication)).thenReturn(owner);
        when(templateRepository.count()).thenReturn(0L);
        when(orderRepository.existsByOrderCode(any())).thenReturn(false);
        when(orderRepository.existsByTransactionId(any())).thenReturn(false);
        when(orderRepository.save(any(TemplatePaymentOrder.class))).thenAnswer(invocation -> {
            TemplatePaymentOrder order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(99L);
            }
            return order;
        });
        when(accessRepository.existsByUserIdAndTemplateIdAndActiveTrue(any(), any())).thenReturn(false);

        return new Fixture(
                service,
                orderRepository,
                accessRepository,
                currentUserService,
                abaPayWayService,
                authentication,
                owner
        );
    }

    private CreateTemplatePaymentRequest createRequest() {
        CreateTemplatePaymentRequest request = new CreateTemplatePaymentRequest();
        request.setTemplateId(10L);
        request.setTemplateName("Khmer Wedding Gold");
        request.setPackageName("Premium");
        request.setAmount(new BigDecimal("5.00"));
        request.setCurrency("USD");
        return request;
    }

    private TemplatePaymentOrder order(AppUser user, PaymentStatus status, BigDecimal amount) {
        TemplatePaymentOrder order = new TemplatePaymentOrder();
        order.setId(99L);
        order.setOrderCode("EVT260526001");
        order.setTransactionId("PW26052612000011");
        order.setUser(user);
        order.setTemplateId(10L);
        order.setTemplateName("Khmer Wedding Gold");
        order.setPackageName("Premium");
        order.setAmount(amount);
        order.setCurrency("USD");
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
            TemplatePaymentOrderRepository orderRepository,
            UserTemplateAccessRepository accessRepository,
            CurrentUserService currentUserService,
            AbaPayWayService abaPayWayService,
            Authentication authentication,
            AppUser owner
    ) {
    }
}
