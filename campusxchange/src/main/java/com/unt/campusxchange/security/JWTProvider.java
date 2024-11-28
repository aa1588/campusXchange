package com.unt.campusxchange.security;

import com.unt.campusxchange.users.repo.UserRepository;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JWTProvider {

    private final JwtEncoder jwtEncoder;
    public static final Long EXPIRATION_TIME_IN_SECONDS = 86400L;
    private final UserRepository userRepository;
    private final JwtDecoder jwtDecoder;

    public String createToken(Authentication authentication) {
        User principal = (User) authentication.getPrincipal();

        // get role
        String role = principal.getAuthorities().toString();

        // get user id
        Optional<com.unt.campusxchange.users.entity.User> userOptional =
                userRepository.findByEmail(principal.getUsername());
        var userID =
                userOptional.map(com.unt.campusxchange.users.entity.User::getId).orElse(null);

        var now = Instant.now();
        assert userID != null;
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("CampusXchange Marketplace")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(EXPIRATION_TIME_IN_SECONDS))
                .subject(principal.getUsername())
                .claim("userId", userID)
                .claim("scope", role)
                .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public String getEmailFromToken(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        return jwt.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            return true;
        } catch (Exception e) {
            throw new InvalidBearerTokenException("The token is invalid or expired. Please provide a valid token.");
        }
    }
}
