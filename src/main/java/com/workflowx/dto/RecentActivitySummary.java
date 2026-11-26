package com.workflowx.dto;

import java.time.LocalDateTime;

public class RecentActivitySummary {

    private Long id;
    private String type;
    private String message;
    private String userName;
    private LocalDateTime createdAt;

    public RecentActivitySummary() {
    }

    public RecentActivitySummary(
            Long id,
            String type,
            String message,
            String userName,
            LocalDateTime createdAt) {

        this.id = id;
        this.type = type;
        this.message = message;
        this.userName = userName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}