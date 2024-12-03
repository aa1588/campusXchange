package com.unt.campusxchange.QA.dto;

import java.time.LocalDateTime;

public record AddAnswerResponse(
        Integer answerId, String answerText, Integer questionId, String answeredBy, LocalDateTime answeredOn) {}
