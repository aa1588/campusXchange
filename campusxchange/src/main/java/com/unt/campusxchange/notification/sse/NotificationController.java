package com.unt.campusxchange.notification.sse;

import com.unt.campusxchange.security.JWTProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final JWTProvider jwtProvider;

    @GetMapping("/subscribe")
    public SseEmitter subscribe(@RequestParam("token") String token) {
        if (!jwtProvider.validateToken(token)) {
            throw new InvalidBearerTokenException("Invalid or expired JWT token");
        }

        String email = jwtProvider.getEmailFromToken(token); // Get the email from Principal
        return notificationService.register(email);
    }
}
