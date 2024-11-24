package com.unt.campusxchange.notification.sse;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/*
 *  Class For Tracking SSE Connections
 * */

@Component
public class NotificationService {
    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter register(String email) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Keep the connection alive
        emitters.put(email, emitter);
        emitter.onCompletion(() -> emitters.remove(email)); // Remove on completion
        emitter.onTimeout(() -> emitters.remove(email)); // Remove on timeout
        return emitter;
    }

    public void sendNotification(String email, Notification notification) {
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(notification));
            } catch (Exception e) {
                emitters.remove(email); // Remove if there's an error
            }
        }
    }
}
