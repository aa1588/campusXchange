package com.unt.campusxchange.admin;

import com.unt.campusxchange.users.entity.AccountStatus;
import com.unt.campusxchange.users.entity.ROLE;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(AdminUserInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@my.unt.edu").isEmpty()) {
            // Create new ADMIN user
            User adminUser = new User();
            adminUser.setFirstname("Default");
            adminUser.setLastname("Admin");
            adminUser.setEmail("admin@my.unt.edu");
            adminUser.setPassword(passwordEncoder.encode("password"));
            adminUser.setPhone("1234567890");
            adminUser.setRole(ROLE.ADMIN);
            adminUser.setAccountStatus(AccountStatus.ACTIVE);
            adminUser.setOtp("0000");

            userRepository.save(adminUser);
            logger.info("Admin user created");

        } else {
            logger.info("Admin user already exists. Skipping creation!!!");
        }
    }
}
