package com.workflowx.repository;

import com.workflowx.entity.CalendarEvent;
import com.workflowx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalendarEventRepository
        extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByCreatedBy(User user);

    List<CalendarEvent> findByStatus(
            CalendarEvent.EventStatus status);

    List<CalendarEvent> findByType(
            CalendarEvent.EventType type);
}