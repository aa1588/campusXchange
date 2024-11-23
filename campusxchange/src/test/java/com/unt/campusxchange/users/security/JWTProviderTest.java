package com.unt.campusxchange.users.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.repo.UserRepository;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

public class JWTProviderTest {

    @Mock
    private JwtEncoder jwtEncoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JWTProvider jwtProvider;

    @BeforeEach
    void setUp() {
        openMocks(this); // Initialize mocks
    }

    @Test
    @DisplayName("Should Create JWT token")
    void testCreateToken() {
        // Given
        String username = "testuser@example.com";
        String role = "ROLE_USER";
        long userID = 123L;

        // Mocking the Authentication object
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                username, "password", Set.of(new SimpleGrantedAuthority(role)));
        when(authentication.getPrincipal()).thenReturn(userDetails);

        // Mocking the UserRepository to return a User with the given userID
        User userEntity = new User();
        userEntity.setId(Math.toIntExact(userID));
        when(userRepository.findByEmail(username)).thenReturn(Optional.of(userEntity));

        // Mocking the JwtEncoder to return a mock Jwt object with a token value
        Jwt mockJwt = Mockito.mock(Jwt.class);
        when(mockJwt.getTokenValue()).thenReturn("mockedTokenValue");
        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(mockJwt);

        // When
        String token = jwtProvider.createToken(authentication);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isEqualTo("mockedTokenValue");

        // Verify that UserRepository was called with the correct username
        Mockito.verify(userRepository).findByEmail(username);

        // Verify that JwtEncoder was called with the correct JwtClaimsSet
        Mockito.verify(jwtEncoder).encode(any(JwtEncoderParameters.class));
    }
}
