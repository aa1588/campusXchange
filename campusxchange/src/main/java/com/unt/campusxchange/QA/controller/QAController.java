package com.unt.campusxchange.QA.controller;

import com.unt.campusxchange.QA.dto.QuestionAnswerResponse;
import com.unt.campusxchange.QA.service.QuestionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions-answers")
@RequiredArgsConstructor
public class QAController {

    private final QuestionService questionService;

    @GetMapping("/{itemId}")
    public ResponseEntity<List<QuestionAnswerResponse>> getQuestionsAndAnswersByItem(@PathVariable Integer itemId) {
        List<QuestionAnswerResponse> response = questionService.getQuestionsAndAnswersByItem(itemId);
        return ResponseEntity.ok(response);
    }
}
