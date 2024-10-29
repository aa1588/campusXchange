package com.unt.campusxchange.QA.controller;

import com.unt.campusxchange.QA.dto.AddAnswerRequest;
import com.unt.campusxchange.QA.dto.AddAnswerResponse;
import com.unt.campusxchange.QA.service.AnswerService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers/")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping("/{questionId}")
    public ResponseEntity<AddAnswerResponse> saveAnswer(
            @PathVariable("questionId") Integer questionId,
            @RequestBody AddAnswerRequest addAnswerRequest,
            Principal principal) {
        String currentUsername = principal.getName(); // username == email
        AddAnswerResponse addAnswerResponse =
                answerService.saveAnswer(currentUsername, questionId, addAnswerRequest.answer());

        return new ResponseEntity<>(addAnswerResponse, HttpStatus.CREATED);
    }
}
