package com.koupreng.backend.auth;

import java.time.Duration;
import java.time.Instant;

import com.koupreng.backend.config.AppProperties;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final String issuer;
    private final Duration accessTokenTtl;

    public JwtService(
            JwtEncoder jwtEncoder,
            AppProperties appProperties
    ) {
        this.jwtEncoder = jwtEncoder;
        this.issuer = appProperties.getJwt().getIssuer();
        this.accessTokenTtl = Duration.ofMinutes(appProperties.getJwt().getAccessTokenMinutes());
    }

    public String createAccessToken(AppUser user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(accessTokenTtl);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("role", user.getRole().name())
                .claim("tokenVersion", user.getTokenVersion())
                .build();

        JwsHeader headers = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(headers, claims)).getTokenValue();
    }

    public long getAccessTokenTtlSeconds() {
        return accessTokenTtl.toSeconds();
    }
}
