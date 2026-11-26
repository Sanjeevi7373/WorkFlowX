package com.workflowx.controller;

import com.workflowx.entity.Notification;
import com.workflowx.entity.User;
import com.workflowx.service.NotificationService;
import com.workflowx.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(
            NotificationService notificationService,
            UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(
            @PathVariable Long id) {

        return notificationService.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotifications(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        return ResponseEntity.ok(
                notificationService.getNotificationsByUser(user)
        );
    }

    @GetMapping("/my/unread")
    public ResponseEntity<List<Notification>> getMyUnreadNotifications(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(user)
        );
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody Notification notification,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        notification.setUser(user);

        Notification savedNotification =
                notificationService.createNotification(notification);

        return ResponseEntity.ok(savedNotification);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(
            @PathVariable Long id,
            @RequestBody Notification updatedNotification) {

        return notificationService.getNotificationById(id)
                .map(existingNotification -> {

                    existingNotification.setTitle(
                            updatedNotification.getTitle());

                    existingNotification.setMessage(
                            updatedNotification.getMessage());

                    existingNotification.setType(
                            updatedNotification.getType());

                    existingNotification.setStatus(
                            updatedNotification.getStatus());

                    if (updatedNotification.getStatus()
                            == Notification.NotificationStatus.READ
                            && existingNotification.getReadAt() == null) {

                        existingNotification.setReadAt(
                                LocalDateTime.now());
                    }

                    if (updatedNotification.getStatus()
                            == Notification.NotificationStatus.UNREAD) {

                        existingNotification.setReadAt(null);
                    }

                    Notification savedNotification =
                            notificationService.updateNotification(
                                    existingNotification);

                    return ResponseEntity.ok(savedNotification);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id) {

        if (notificationService
                .getNotificationById(id)
                .isEmpty()) {

            return ResponseEntity.notFound().build();
        }

        notificationService.deleteNotification(id);

        return ResponseEntity.ok(
                "Notification deleted successfully"
        );
    }
}