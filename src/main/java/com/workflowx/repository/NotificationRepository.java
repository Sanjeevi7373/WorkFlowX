package com.workflowx.repository;

import com.workflowx.entity.Notification;
import com.workflowx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUser(User user);

    List<Notification> findByUserAndStatus(
            User user,
            Notification.NotificationStatus status);

    List<Notification> findByType(
            Notification.NotificationType type);
}