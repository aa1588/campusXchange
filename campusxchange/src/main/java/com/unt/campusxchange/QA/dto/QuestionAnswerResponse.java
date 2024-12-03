package com.unt.campusxchange.QA.dto;

import java.time.LocalDateTime;
import java.util.List;

public record QuestionAnswerResponse(
        Integer questionId,
        String questionText,
        String askedBy,
        LocalDateTime createdAt,
        List<AnswerResponse> answers) {}
