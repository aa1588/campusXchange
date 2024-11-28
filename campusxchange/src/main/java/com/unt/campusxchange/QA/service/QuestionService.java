package com.unt.campusxchange.QA.service;

import com.unt.campusxchange.QA.dto.AddQuestionResponse;
import com.unt.campusxchange.QA.dto.AnswerResponse;
import com.unt.campusxchange.QA.dto.QuestionAnswerResponse;
import com.unt.campusxchange.QA.entitty.Question;
import com.unt.campusxchange.QA.repo.QuestionRepository;
import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.notification.sse.Notification;
import com.unt.campusxchange.notification.sse.NotificationService;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;

    public AddQuestionResponse addQuestion(String email, Integer itemId, String questionText) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ItemNotFoundException("Item not found"));

        Question question = new Question();
        question.setItem(item);
        question.setAskedBy(user);
        question.setQuestionText(questionText);
        question.setCreatedAt(LocalDateTime.now());

        questionRepository.save(question);

        /* Test for SSE-Notification System */
        Notification notification = new Notification("You have unanswered question for Item: " + item.getTitle(), Instant.now());

        notificationService.sendNotification(item.getUser().getEmail(), notification);
        /* Test for SSE-Notification System */

        return new AddQuestionResponse(question.getId(), question.getQuestionText(), email, question.getCreatedAt());
    }

    public List<AddQuestionResponse> getQuestionsByItem(String email, Integer itemId) {

        userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        itemRepository.findById(itemId).orElseThrow(() -> new ItemNotFoundException("Item not found"));

        return questionRepository.findByItemId(itemId).stream()
                .map(question -> new AddQuestionResponse(
                        question.getId(),
                        question.getQuestionText(),
                        question.getAskedBy().getEmail(),
                        question.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<QuestionAnswerResponse> getQuestionsAndAnswersByItem(Integer itemId) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ItemNotFoundException("Item not found"));

        return questionRepository.findByItemId(itemId).stream()
                .map(question -> new QuestionAnswerResponse(
                        question.getId(),
                        question.getQuestionText(),
                        question.getAskedBy().getEmail(),
                        question.getCreatedAt(),
                        question.getAnswers().stream()
                                .map(answer -> new AnswerResponse(
                                        answer.getId(),
                                        answer.getAnswerText(),
                                        answer.getAnsweredBy().getEmail(),
                                        answer.getCreatedAt()))
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());
    }
}
