package com.workflowx.service;

import com.workflowx.dto.AuthResponse;
import com.workflowx.dto.LoginRequest;
import com.workflowx.dto.RegisterRequest;
import com.workflowx.entity.User;
import com.workflowx.repository.UserRepository;
import com.workflowx.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {

        String email = request.getEmail() == null ? null : request.getEmail().trim();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Please enter your email address.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists. Sign in or use another email."
            );
        }

        User user = new User();

        user.setEmail(email);
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setDepartment(request.getDepartment());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(User.Role.EMPLOYEE);
        user.setStatus(User.UserStatus.ACTIVE);

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userRepository.findByEmail(request.getEmail().trim())
                        .map(user -> org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .authorities(
                                        "ROLE_" + user.getRole().name()
                                )
                                .build()
                        )
                        .orElseThrow();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }
}
