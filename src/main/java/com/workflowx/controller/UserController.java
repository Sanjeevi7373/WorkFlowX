
package com.workflowx.controller;

import com.workflowx.entity.User;
import com.workflowx.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            Authentication authentication,
            @RequestBody Map<String, String> request) {

        String email = authentication.getName();

        return userService.getUserByEmail(email)
                .map(user -> {
                    String firstName = request.get("firstName");
                    String lastName = request.get("lastName");
                    String department = request.get("department");

                    if (firstName == null || firstName.isBlank()
                            || lastName == null || lastName.isBlank()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of(
                                        "message",
                                        "First name and last name are required."
                                ));
                    }

                    user.setFirstName(firstName.trim());
                    user.setLastName(lastName.trim());
                    user.setDepartment(
                            department == null || department.isBlank()
                                    ? null
                                    : department.trim()
                    );

                    User updatedUser = userService.saveUser(user);

                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
