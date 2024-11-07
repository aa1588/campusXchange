package com.unt.campusxchange.QA.controller;

import com.unt.campusxchange.QA.dto.AddQuestionRequest;
import com.unt.campusxchange.QA.dto.AddQuestionResponse;
import com.unt.campusxchange.QA.service.QuestionService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions/item")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/{itemId}")
    public ResponseEntity<AddQuestionResponse> addQuestion(
            @PathVariable Integer itemId, @RequestBody AddQuestionRequest addQuestionRequest, Principal principal) {

        String currentUsername = principal.getName(); // username == email
        AddQuestionResponse q = questionService.addQuestion(currentUsername, itemId, addQuestionRequest.question());
        return new ResponseEntity<>(q, HttpStatus.CREATED);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<List<AddQuestionResponse>> getQuestionsByItem(
            @PathVariable Integer itemId, Principal principal) {

        String currentUsername = principal.getName(); // username == email
        List<AddQuestionResponse> q = questionService.getQuestionsByItem(currentUsername, itemId);
        return new ResponseEntity<>(q, HttpStatus.OK);
    }
}
