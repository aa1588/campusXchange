package com.unt.campusxchange.QA.dto;

import java.time.LocalDateTime;

public record AddQuestionResponse(
        Integer questionId, String questionText, String questionBy, LocalDateTime createdAt) {}
