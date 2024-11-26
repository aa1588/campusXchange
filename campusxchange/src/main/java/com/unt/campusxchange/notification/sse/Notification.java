package com.unt.campusxchange.notification.sse;

import java.time.Instant;

public record Notification(String message, Instant timestamp) {}
