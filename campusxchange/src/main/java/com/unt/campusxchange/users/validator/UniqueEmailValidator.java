package com.unt.campusxchange.users.validator;

import com.unt.campusxchange.users.repo.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Service;

@Service
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    private static final String REQUIRED_DOMAIN = "my.unt.edu";

    private final UserRepository userRepository;

    public UniqueEmailValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {

        // Check if email ends with @my.unt.edu
        if (!email.endsWith("@" + REQUIRED_DOMAIN)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Email must end with @" + REQUIRED_DOMAIN)
                    .addConstraintViolation();
            return false;
        }

        // Check if email is unique
        if (userRepository.existsByEmail(email)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Email is already in use")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
