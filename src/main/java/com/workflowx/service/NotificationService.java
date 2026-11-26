package com.workflowx.service;

import com.workflowx.entity.Notification;
import com.workflowx.entity.User;
import com.workflowx.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUser(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndStatus(
                user,
                Notification.NotificationStatus.UNREAD
        );
    }

    public List<Notification> getNotificationsByType(
            Notification.NotificationType type) {
        return notificationRepository.findByType(type);
    }

    public Notification updateNotification(
            Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}