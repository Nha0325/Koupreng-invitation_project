package com.koupreng.backend.service;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.AppProperties;
import com.koupreng.backend.dto.TelegramLoginRequest;
import com.koupreng.backend.entity.user.AuthProvider;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

class TelegramIdentityVerifierTests {

    private static final String BOT_TOKEN = "123456789:ABCdef_TestToken";
    private static final String CLIENT_ID = "123456789";

    private RSAKey rsaKey;
    private HttpServer jwkServer;
    private String jwkSetUri;

    @BeforeEach
    void setUp() throws Exception {
        rsaKey = new RSAKeyGenerator(2048)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .keyID("telegram-test-key")
                .generate();

        jwkServer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        jwkServer.createContext("/jwks", this::handleJwkSetRequest);
        jwkServer.start();
        jwkSetUri = "http://127.0.0.1:" + jwkServer.getAddress().getPort() + "/jwks";
    }

    @AfterEach
    void tearDown() {
        if (jwkServer != null) {
            jwkServer.stop(0);
        }
    }

    @Test
    void acceptsValidTelegramLoginData() {
        TelegramIdentityVerifier verifier = new TelegramIdentityVerifier(appProperties());
        long authDate = Instant.now().getEpochSecond();
        TelegramLoginRequest request = request(authDate, hash(authDate));

        ExternalAuthIdentity identity = verifier.verify(request);

        assertEquals(AuthProvider.TELEGRAM, identity.provider());
        assertEquals("42", identity.providerId());
        assertEquals("telegram-42@telegram.local", identity.email());
        assertEquals("Vireak Test", identity.fullName());
    }

    @Test
    void acceptsValidTelegramIdToken() throws Exception {
        TelegramIdentityVerifier verifier = new TelegramIdentityVerifier(appProperties());
        TelegramLoginRequest request = new TelegramLoginRequest(
                signedTelegramIdToken(CLIENT_ID),
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );

        ExternalAuthIdentity identity = verifier.verify(request);

        assertEquals(AuthProvider.TELEGRAM, identity.provider());
        assertEquals("987654321", identity.providerId());
        assertEquals("telegram-987654321@telegram.local", identity.email());
        assertEquals("Telegram User", identity.fullName());
    }

    @Test
    void rejectsInvalidTelegramHash() {
        TelegramIdentityVerifier verifier = new TelegramIdentityVerifier(appProperties());
        long authDate = Instant.now().getEpochSecond();
        TelegramLoginRequest request = request(authDate, "bad-hash");

        assertEquals(
                "Invalid Telegram login data",
                assertThrows(ApiException.class, () -> verifier.verify(request)).getMessage()
        );
    }

    private AppProperties appProperties() {
        AppProperties appProperties = new AppProperties();
        appProperties.getOauth().getTelegram().setBotToken(BOT_TOKEN);
        appProperties.getOauth().getTelegram().setClientId(CLIENT_ID);
        appProperties.getOauth().getTelegram().setJwkSetUri(jwkSetUri);
        return appProperties;
    }

    private TelegramLoginRequest request(long authDate, String hash) {
        return new TelegramLoginRequest(
                null,
                42L,
                "Vireak",
                "Test",
                "vireak",
                "https://example.com/photo.jpg",
                authDate,
                hash
        );
    }

    private String hash(long authDate) {
        Map<String, String> values = new TreeMap<>();
        values.put("auth_date", String.valueOf(authDate));
        values.put("first_name", "Vireak");
        values.put("id", "42");
        values.put("last_name", "Test");
        values.put("photo_url", "https://example.com/photo.jpg");
        values.put("username", "vireak");
        String dataCheckString = values.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("\n"));

        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] secretKey = sha256.digest(BOT_TOKEN.getBytes(StandardCharsets.UTF_8));
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(secretKey, "HmacSHA256"));
            return HexFormat.of().formatHex(hmac.doFinal(dataCheckString.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException | InvalidKeyException exception) {
            throw new IllegalStateException(exception);
        }
    }

    private String signedTelegramIdToken(String audience) throws JOSEException {
        Instant now = Instant.now();
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer("https://oauth.telegram.org")
                .subject("telegram-subject-123")
                .audience(audience)
                .issueTime(Date.from(now.minusSeconds(30)))
                .expirationTime(Date.from(now.plusSeconds(300)))
                .claim("id", 987654321L)
                .claim("name", "Telegram User")
                .claim("preferred_username", "telegram_user")
                .build();

        SignedJWT jwt = new SignedJWT(
                new JWSHeader.Builder(JWSAlgorithm.RS256)
                        .keyID(rsaKey.getKeyID())
                        .build(),
                claims
        );
        jwt.sign(new RSASSASigner(rsaKey));
        return jwt.serialize();
    }

    private void handleJwkSetRequest(HttpExchange exchange) throws IOException {
        byte[] responseBody = new JWKSet(rsaKey.toPublicJWK())
                .toString()
                .getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, responseBody.length);
        try (exchange; var responseStream = exchange.getResponseBody()) {
            responseStream.write(responseBody);
        }
    }
}

