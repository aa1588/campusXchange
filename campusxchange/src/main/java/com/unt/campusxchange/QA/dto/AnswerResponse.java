package com.unt.campusxchange.QA.dto;

import java.time.LocalDateTime;

public record AnswerResponse(Integer answerId, String answerText, String answeredBy, LocalDateTime createdAt) {}
