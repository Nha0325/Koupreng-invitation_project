package com.koupreng.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.AppProperties;
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

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GoogleIdentityVerifierTests {

    private static final String CLIENT_ID = "test-client-id.apps.googleusercontent.com";

    private RSAKey rsaKey;
    private HttpServer jwkServer;
    private String jwkSetUri;

    @BeforeEach
    void setUp() throws Exception {
        rsaKey = new RSAKeyGenerator(2048)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256)
                .keyID("test-key")
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
    void acceptsValidGoogleTokenFromConfiguredJwkSet() throws Exception {
        GoogleIdentityVerifier verifier = new GoogleIdentityVerifier(appProperties());

        ExternalAuthIdentity identity = verifier.verify(signedGoogleToken(CLIENT_ID));

        assertEquals(AuthProvider.GOOGLE, identity.provider());
        assertEquals("google-subject-123", identity.providerId());
        assertEquals("google.user@example.com", identity.email());
        assertEquals("Google User", identity.fullName());
    }

    @Test
    void rejectsTokenWithUnapprovedAudience() throws Exception {
        GoogleIdentityVerifier verifier = new GoogleIdentityVerifier(appProperties());

        assertThrows(ApiException.class, () -> verifier.verify(signedGoogleToken("other-client-id")));
    }

    private AppProperties appProperties() {
        AppProperties appProperties = new AppProperties();
        appProperties.getOauth().getGoogle().setClientIds(List.of(CLIENT_ID));
        appProperties.getOauth().getGoogle().setJwkSetUri(jwkSetUri);
        return appProperties;
    }

    private String signedGoogleToken(String audience) throws JOSEException {
        Instant now = Instant.now();
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer("https://accounts.google.com")
                .subject("google-subject-123")
                .audience(audience)
                .issueTime(Date.from(now.minusSeconds(30)))
                .expirationTime(Date.from(now.plusSeconds(300)))
                .claim("email", "Google.User@Example.com")
                .claim("email_verified", true)
                .claim("name", "Google User")
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

