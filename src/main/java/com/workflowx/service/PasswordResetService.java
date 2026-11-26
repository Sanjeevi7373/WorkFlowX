
package com.workflowx.service;

import com.workflowx.entity.PasswordResetToken;
import com.workflowx.entity.User;
import com.workflowx.repository.PasswordResetTokenRepository;
import com.workflowx.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Public entry point. Looks up the user once, then delegates to a
     * transactional DB method and a mail method — keeping them separate so
     * that a mail failure never rolls back the saved token or surfaces a 500
     * to the caller.
     */
    public void requestPasswordReset(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            // No account found — return silently (security: don't reveal existence).
            return;
        }

        User user = optionalUser.get();
        String rawToken = createResetToken(user);
        sendResetEmail(user, rawToken);
    }

    /** Creates (or replaces) a password-reset token in the DB for a known
     *  {@link User}. Returns the raw (unhashed) token. */
    @Transactional
    protected String createResetToken(User user) {
        // Invalidate any earlier reset links for this account.
        tokenRepository.deleteAllByUser_Id(user.getId());
        tokenRepository.flush();

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setTokenHash(sha256(rawToken));
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));

        tokenRepository.save(resetToken);

        return rawToken;
    }

    /** Sends the reset email. Catches {@link MailException} so that an SMTP
     *  failure is logged but never propagated to the HTTP layer. */
    private void sendResetEmail(User user, String rawToken) {
        String resetLink = frontendUrl.replaceAll("/+$", "")
                + "/reset-password?token=" + rawToken;

        String firstName = (user.getFirstName() != null) ? user.getFirstName() : "there";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Reset your WorkflowX password");
        message.setText(
                "Hello " + firstName + ",\n\n"
                + "We received a request to reset your WorkflowX password.\n\n"
                + "Open this link within 15 minutes to choose a new password:\n"
                + resetLink + "\n\n"
                + "If you did not request this, you can ignore this email.\n\n"
                + "WorkflowX Team"
        );

        try {
            mailSender.send(message);
            log.info("Password-reset email sent to {}", user.getEmail());
        } catch (MailException ex) {
            // Log the failure but do NOT re-throw — the token is already saved
            // and the caller always receives a 200 OK regardless.
            log.error("Failed to send password-reset email to {}: {}", user.getEmail(), ex.getMessage());
        }
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hash);
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Invalid or expired reset link.");
        }

        if (newPassword == null || newPassword.length() < 8
                || newPassword.length() > 72) {
            throw new IllegalArgumentException(
                    "Password must contain between 8 and 72 characters."
            );
        }

        String tokenHash = sha256(rawToken);

        PasswordResetToken resetToken = tokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid or expired reset link."
                ));

        if (resetToken.getUsedAt() != null
                || !resetToken.getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid or expired reset link.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsedAt(LocalDateTime.now());
        tokenRepository.save(resetToken);

        // Invalidate any other reset links associated with this user.
        tokenRepository.deleteAllByUser_Id(user.getId());
    }
}
