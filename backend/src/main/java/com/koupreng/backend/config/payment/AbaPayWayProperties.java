package com.koupreng.backend.config.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.payment.payway")
public class AbaPayWayProperties {

    private String merchantId = "";
    private String publicKey = "";
    private String rsaPublicKey = "";
    private String rsaPrivateKey = "";
    private String apiUrl = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";
    private String returnUrl = "http://localhost:5173/payments/return";
    private String cancelUrl = "http://localhost:5173/payments/cancel";
    private String continueSuccessUrl = "http://localhost:5173/payments/success";
    private String callbackUrl = "http://localhost:8080/api/v1/payway/callback";
    private boolean sandbox = true;
    private String paymentOption = "abapay";

    public String getMerchantId() {
        return trim(merchantId);
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public String getPublicKey() {
        return normalizeKey(publicKey);
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getRsaPublicKey() {
        return normalizeKey(rsaPublicKey);
    }

    public void setRsaPublicKey(String rsaPublicKey) {
        this.rsaPublicKey = rsaPublicKey;
    }

    public String getRsaPrivateKey() {
        return normalizeKey(rsaPrivateKey);
    }

    public void setRsaPrivateKey(String rsaPrivateKey) {
        this.rsaPrivateKey = rsaPrivateKey;
    }

    public String getApiUrl() {
        return trim(apiUrl);
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public String getReturnUrl() {
        return trim(returnUrl);
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public String getCancelUrl() {
        return trim(cancelUrl);
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }

    public String getContinueSuccessUrl() {
        return trim(continueSuccessUrl);
    }

    public void setContinueSuccessUrl(String continueSuccessUrl) {
        this.continueSuccessUrl = continueSuccessUrl;
    }

    public String getCallbackUrl() {
        return trim(callbackUrl);
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public boolean isSandbox() {
        return sandbox;
    }

    public void setSandbox(boolean sandbox) {
        this.sandbox = sandbox;
    }

    public String getPaymentOption() {
        return trim(paymentOption).isBlank() ? "abapay" : trim(paymentOption);
    }

    public void setPaymentOption(String paymentOption) {
        this.paymentOption = paymentOption;
    }

    public String getCheckTransactionUrl() {
        String url = getApiUrl();
        if (url.endsWith("/purchase")) {
            return url.substring(0, url.length() - "/purchase".length()) + "/check-transaction-2";
        }
        return url.replace("/payments/purchase", "/payments/check-transaction-2");
    }

    private String normalizeKey(String value) {
        return trim(value).replace("\\n", "\n");
    }

    private String trim(String value) {
        if (value == null) {
            return "";
        }
        String trimmed = value.trim();
        if (trimmed.length() >= 2
                && ((trimmed.startsWith("\"") && trimmed.endsWith("\""))
                || (trimmed.startsWith("'") && trimmed.endsWith("'")))) {
            return trimmed.substring(1, trimmed.length() - 1).trim();
        }
        return trimmed;
    }
}
