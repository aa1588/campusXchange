package com.unt.campusxchange.users.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

import com.unt.campusxchange.users.entity.AccountStatus;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.InvalidOTPException;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService userService;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User();
        user.setId(1);
        user.setOtp("123456");
        user.setAccountStatus(AccountStatus.INACTIVE); // Assume inactive by default
    }

    @Test
    @DisplayName("Activate account with valid OTP")
    public void shouldActivateAccountWithValidOTP() {

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        boolean result = userService.activateAccount(1, "123456");

        assertThat(result).isTrue();
        assertThat(user.getAccountStatus()).isEqualTo(AccountStatus.ACTIVE);
        verify(userRepository).save(user); // Verify that the save method is called
    }

    @Test
    @DisplayName("Throw exception for invalid OTP during account activation")
    public void shouldThrowExceptionForInvalidOTP() {

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> userService.activateAccount(1, "654321"))
                .isInstanceOf(InvalidOTPException.class)
                .hasMessageContaining("Provided OTP 654321 doesn't match our records");

        verify(userRepository, never()).save(user); // Verify that save is never called
    }

    @Test
    @DisplayName("Generate 4-digit OTP")
    void testGenerateOTP() {

        String otp = AuthService.generateOTP();

        assertThat(otp).isNotNull();
        assertThat(otp.length()).isEqualTo(4);

        int otpInt = Integer.parseInt(otp);
        assertThat(otpInt).isBetween(1000, 9999);
    }

    @Test
    @DisplayName("Throw exception when user is not found during account activation")
    public void shouldThrowExceptionWhenUserNotFound() {

        when(userRepository.findById(2)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.activateAccount(2, "123456"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User not found with given id: 2");

        verify(userRepository, never()).save(user); // Verify that save is never called
    }

    @Test
    @DisplayName("Test account activation")
    void activateAccount() {}

    @Test
    @DisplayName("Test login functionality")
    void login() {}
}
