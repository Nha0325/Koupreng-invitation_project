package com.koupreng.backend.config;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.AuthProvider;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.repository.AppUserRepository;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;

/**
 * Maps a verified Supabase JWT to an authenticated principal backed by app_users.
 *
 * The Supabase access token contains:
 *   sub  -> auth.users.id (UUID)
 *   email
 *   role -> "authenticated" / "service_role"
 *   app_metadata.provider -> "email" | "google" | "telegram" | ...
 *   user_metadata.full_name (optional)
 *
 * If the matching app_users row hasn't been created yet by the SQL trigger
 * (or the user signed up via the admin API and bypassed it), we lazily create one.
 */
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
                .orElseGet(() -> provisionUser(jwt, userId));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        return new JwtAuthenticationToken(jwt, authorities, user.getEmail());
    }

    private AppUser provisionUser(Jwt jwt, UUID userId) {
        AppUser user = new AppUser();
        user.setId(userId);
        user.setEmail(safeString(jwt.getClaimAsString("email")));

        String fullName = readFullName(jwt);
        if (fullName == null || fullName.isBlank()) {
            String email = user.getEmail();
            fullName = email == null ? "User" : email.split("@")[0];
        }
        user.setFullName(fullName);

        user.setAuthProvider(readProvider(jwt));
        user.setProviderId(readProviderId(jwt));
        user.setRole(Role.USER);
        user.setEnabled(true);

        Instant now = Instant.now();
        // PrePersist sets these too, but explicit assignment avoids null in tests
        return userRepository.save(user);
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

    private String readFullName(Jwt jwt) {
        Object userMetadata = jwt.getClaim("user_metadata");
        if (userMetadata instanceof java.util.Map<?, ?> map) {
            Object value = map.get("full_name");
            if (value instanceof String name && !name.isBlank()) {
                return name;
            }
            value = map.get("name");
            if (value instanceof String name && !name.isBlank()) {
                return name;
            }
        }
        return null;
    }

    private AuthProvider readProvider(Jwt jwt) {
        Object appMetadata = jwt.getClaim("app_metadata");
        if (appMetadata instanceof java.util.Map<?, ?> map) {
            Object provider = map.get("provider");
            if (provider instanceof String value) {
                return switch (value.toLowerCase()) {
                    case "google" -> AuthProvider.GOOGLE;
                    case "telegram" -> AuthProvider.TELEGRAM;
                    default -> AuthProvider.LOCAL;
                };
            }
        }
        return AuthProvider.LOCAL;
    }

    private String readProviderId(Jwt jwt) {
        Object appMetadata = jwt.getClaim("app_metadata");
        if (appMetadata instanceof java.util.Map<?, ?> map) {
            Object value = map.get("provider_id");
            if (value instanceof String s && !s.isBlank()) {
                return s;
            }
        }
        return null;
    }

    private String safeString(String value) {
        return value == null ? "" : value;
    }
}
