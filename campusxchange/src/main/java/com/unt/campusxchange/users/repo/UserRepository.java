package com.unt.campusxchange.users.repo;

import com.unt.campusxchange.users.entity.AccountStatus;
import com.unt.campusxchange.users.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByAccountStatus(AccountStatus accountStatus);

    long count(); // For total users

    List<User> findAllByOrderByIdAsc();
}
