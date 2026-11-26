package com.workflowx.controller;

import com.workflowx.entity.CalendarEvent;
import com.workflowx.entity.User;
import com.workflowx.service.CalendarEventService;
import com.workflowx.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;
    private final UserService userService;

    public CalendarEventController(
            CalendarEventService calendarEventService,
            UserService userService) {
        this.calendarEventService = calendarEventService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEvent>> getAllEvents() {
        return ResponseEntity.ok(calendarEventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEvent> getEventById(
            @PathVariable Long id) {

        return calendarEventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CalendarEvent> createEvent(
            @RequestBody CalendarEvent event,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        event.setCreatedBy(user);

        CalendarEvent savedEvent =
                calendarEventService.createEvent(event);

        return ResponseEntity.ok(savedEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(
            @PathVariable Long id,
            @RequestBody CalendarEvent updatedEvent) {

        return calendarEventService.getEventById(id)
                .map(existingEvent -> {

                    existingEvent.setTitle(updatedEvent.getTitle());
                    existingEvent.setDescription(
                            updatedEvent.getDescription());
                    existingEvent.setStartTime(
                            updatedEvent.getStartTime());
                    existingEvent.setEndTime(
                            updatedEvent.getEndTime());
                    existingEvent.setLocation(
                            updatedEvent.getLocation());
                    existingEvent.setType(
                            updatedEvent.getType());
                    existingEvent.setStatus(
                            updatedEvent.getStatus());

                    CalendarEvent savedEvent =
                            calendarEventService.updateEvent(existingEvent);

                    return ResponseEntity.ok(savedEvent);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(
            @PathVariable Long id) {

        if (calendarEventService.getEventById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        calendarEventService.deleteEvent(id);

        return ResponseEntity.ok("Calendar event deleted successfully");
    }
}