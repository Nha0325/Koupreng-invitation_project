package com.koupreng.backend.config;

import java.util.List;

import com.koupreng.backend.auth.AppUser;
import com.koupreng.backend.auth.AppUserRepository;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class AppJwtAuthenticationConverter implements Converter<Jwt, JwtAuthenticationToken> {

    private final AppUserRepository userRepository;

    public AppJwtAuthenticationConverter(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public JwtAuthenticationToken convert(Jwt jwt) {
        AppUser user = userRepository.findById(readLongClaim(jwt, "uid"))
                .orElseThrow(() -> new BadCredentialsException("Invalid token"));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        if (user.getTokenVersion() != readIntClaim(jwt, "tokenVersion")) {
            throw new BadCredentialsException("Token has been revoked");
        }

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        return new JwtAuthenticationToken(jwt, authorities, user.getEmail());
    }

    private long readLongClaim(Jwt jwt, String claimName) {
        Object value = jwt.getClaim(claimName);
        if (value instanceof Number number) {
            return number.longValue();
        }
        throw new BadCredentialsException("Invalid token");
    }

    private int readIntClaim(Jwt jwt, String claimName) {
        Object value = jwt.getClaim(claimName);
        if (value instanceof Number number) {
            return number.intValue();
        }
        throw new BadCredentialsException("Invalid token");
    }
}
