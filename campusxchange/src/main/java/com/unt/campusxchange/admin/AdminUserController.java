package com.unt.campusxchange.admin;

import com.unt.campusxchange.users.dto.UserDTO;
import com.unt.campusxchange.users.entity.AccountStatus;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('SCOPE_[ROLE_ADMIN]')")
public class AdminUserController {

    private final UserRepository userRepository;
    private final AdminUserService adminUserService;

    public AdminUserController(UserRepository userRepository, AdminUserService adminUserService) {
        this.userRepository = userRepository;
        this.adminUserService = adminUserService;
    }

    @PutMapping("/change-status/{userId}")
    public ResponseEntity<String> changeAccountStatus(@PathVariable Integer userId, @RequestParam String status) {

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setAccountStatus(AccountStatus.valueOf(status));
        userRepository.save(user);

        return ResponseEntity.ok("User status updated to " + status);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats accountDashboard = adminUserService.getDashboardStats();
        return ResponseEntity.ok(accountDashboard);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('SCOPE_[ROLE_ADMIN]')")
    public ResponseEntity<List<UserDTO>> getUsers(Principal principal) {
        String username = principal.getName();
        List<UserDTO> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
