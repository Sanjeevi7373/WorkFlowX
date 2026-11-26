
package com.workflowx.controller;

import com.workflowx.dto.AuthResponse;
import com.workflowx.dto.LoginRequest;
import com.workflowx.dto.RegisterRequest;
import com.workflowx.service.AuthService;
import com.workflowx.service.AuditLogService;
import com.workflowx.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuditLogService auditLogService;
    private final PasswordResetService passwordResetService;

    public AuthController(
            AuthService authService,
            AuditLogService auditLogService,
            PasswordResetService passwordResetService
    ) {
        this.authService = authService;
        this.auditLogService = auditLogService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request
    ) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        auditLogService.logLogin(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody Map<String, String> request
    ) {
        String email = request.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Please enter your email address.")
            );
        }

        passwordResetService.requestPasswordReset(email.trim());

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "If an account exists for that email, a password-reset link will be sent."
                )
        );
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> request
    ) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        try {
            passwordResetService.resetPassword(token, newPassword);

            return ResponseEntity.ok(
                    Map.of("message", "Password reset successfully. You can now log in.")
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage())
            );
        }
    }

}
