package com.unt.campusxchange.users.security;

import com.unt.campusxchange.users.repo.UserRepository;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JWTProvider {

    private final JwtEncoder jwtEncoder;
    public static final Long EXPIRATION_TIME_IN_SECONDS = 86400L;
    private final UserRepository userRepository;

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
}
