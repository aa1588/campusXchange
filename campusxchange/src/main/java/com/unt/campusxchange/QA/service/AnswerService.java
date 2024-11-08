package com.unt.campusxchange.QA.service;

import com.unt.campusxchange.QA.dto.AddAnswerResponse;
import com.unt.campusxchange.QA.entitty.Answer;
import com.unt.campusxchange.QA.entitty.Question;
import com.unt.campusxchange.QA.exception.ItemOwnershipRequiredException;
import com.unt.campusxchange.QA.exception.QuestionNotFoundException;
import com.unt.campusxchange.QA.repo.AnswerRepository;
import com.unt.campusxchange.QA.repo.QuestionRepository;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public AddAnswerResponse saveAnswer(String email, Integer questionId, String answerText) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        Question question = questionRepository
                .findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException("Question not found"));

        // Verify if the logged-in user is the item owner
        if (!question.getItem().getUser().getEmail().equals(user.getEmail())) {
            throw new ItemOwnershipRequiredException("Only the item owner can answer questions.");
        }

        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setAnsweredBy(user);
        answer.setAnswerText(answerText);
        answer.setCreatedAt(LocalDateTime.now());

        answerRepository.save(answer);

        return new AddAnswerResponse(
                answer.getId(),
                answer.getAnswerText(),
                answer.getQuestion().getId(),
                answer.getAnsweredBy().getEmail(),
                answer.getCreatedAt());
    }
}
