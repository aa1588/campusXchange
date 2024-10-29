package com.unt.campusxchange.QA.repo;

import com.unt.campusxchange.QA.entitty.Question;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByItemId(Integer itemId);
}
