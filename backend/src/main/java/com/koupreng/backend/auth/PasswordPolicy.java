package com.koupreng.backend.auth;

import java.util.Locale;

import com.koupreng.backend.common.ApiException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class PasswordPolicy {

    private static final int MIN_LENGTH = 12;

    public void validate(String password, AppUser user) {
        validate(password, user.getEmail(), user.getFullName());
    }

    public void validate(String password, String email, String fullName) {
        if (password == null || password.length() < MIN_LENGTH) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password must be at least 12 characters long");
        }

        boolean hasLowercase = false;
        boolean hasUppercase = false;
        boolean hasDigit = false;
        boolean hasSymbol = false;

        for (int index = 0; index < password.length(); index++) {
            char character = password.charAt(index);
            if (Character.isWhitespace(character)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Password cannot contain whitespace");
            }
            if (Character.isLowerCase(character)) {
                hasLowercase = true;
            } else if (Character.isUpperCase(character)) {
                hasUppercase = true;
            } else if (Character.isDigit(character)) {
                hasDigit = true;
            } else if (!Character.isLetterOrDigit(character)) {
                hasSymbol = true;
            }
        }

        if (!hasLowercase || !hasUppercase || !hasDigit || !hasSymbol) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Password must include uppercase, lowercase, number, and symbol characters"
            );
        }

        rejectPersonalInfo(password, email, fullName);
    }

    private void rejectPersonalInfo(String password, String email, String fullName) {
        String normalizedPassword = password.toLowerCase(Locale.ROOT);
        String emailLocalPart = email == null ? "" : email.split("@", 2)[0].toLowerCase(Locale.ROOT);
        if (emailLocalPart.length() >= 3 && normalizedPassword.contains(emailLocalPart)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password cannot contain your email");
        }

        if (fullName == null) {
            return;
        }

        for (String namePart : fullName.toLowerCase(Locale.ROOT).split("[^a-z0-9]+")) {
            if (namePart.length() >= 3 && normalizedPassword.contains(namePart)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Password cannot contain your name");
            }
        }
    }
}
