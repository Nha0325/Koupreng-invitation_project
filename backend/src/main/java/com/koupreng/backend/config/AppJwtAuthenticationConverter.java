package com.koupreng.backend.config;

import java.util.List;
import java.util.UUID;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.repository.AppUserRepository;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;

public class AppJwtAuthenticationConverter implements Converter<Jwt, JwtAuthenticationToken> {

    private final AppUserRepository userRepository;

    public AppJwtAuthenticationConverter(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public JwtAuthenticationToken convert(Jwt jwt) {
        UUID userId = parseUserId(jwt.getSubject());
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("Authentication required"));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }
        validateTokenVersion(jwt, user);

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        return new JwtAuthenticationToken(jwt, authorities, user.getId().toString());
    }

    private UUID parseUserId(String subject) {
        if (subject == null || subject.isBlank()) {
            throw new BadCredentialsException("Token is missing subject");
        }
        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException ex) {
            throw new BadCredentialsException("Token subject is not a valid UUID");
        }
    }

    private void validateTokenVersion(Jwt jwt, AppUser user) {
        Object value = jwt.getClaim("token_version");
        if (!(value instanceof Number version) || version.intValue() != user.getTokenVersion()) {
            throw new BadCredentialsException("Authentication required");
        }
    }
}
