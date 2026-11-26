package com.workflowx.service;

import com.workflowx.entity.CalendarEvent;
import com.workflowx.entity.User;
import com.workflowx.repository.CalendarEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;

    public CalendarEventService(
            CalendarEventRepository calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }

    public CalendarEvent createEvent(CalendarEvent event) {
        return calendarEventRepository.save(event);
    }

    public List<CalendarEvent> getAllEvents() {
        return calendarEventRepository.findAll();
    }

    public Optional<CalendarEvent> getEventById(Long id) {
        return calendarEventRepository.findById(id);
    }

    public List<CalendarEvent> getEventsByUser(User user) {
        return calendarEventRepository.findByCreatedBy(user);
    }

    public List<CalendarEvent> getEventsByStatus(
            CalendarEvent.EventStatus status) {
        return calendarEventRepository.findByStatus(status);
    }

    public List<CalendarEvent> getEventsByType(
            CalendarEvent.EventType type) {
        return calendarEventRepository.findByType(type);
    }

    public CalendarEvent updateEvent(CalendarEvent event) {
        return calendarEventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        calendarEventRepository.deleteById(id);
    }
}