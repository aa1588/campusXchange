package com.unt.campusxchange.recommendations.controller;

import com.unt.campusxchange.items.dto.CreateItemResponse;
import com.unt.campusxchange.recommendations.service.RecommendationService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public List<CreateItemResponse> getRecommendations(Principal principal) {
        String currentUsername = principal.getName(); // username == email

        return recommendationService.getRecommendedItemsForUser(currentUsername);
    }
}
