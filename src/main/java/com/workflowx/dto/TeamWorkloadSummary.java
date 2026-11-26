package com.workflowx.dto;

public class TeamWorkloadSummary {

    private Long userId;
    private String userName;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;

    public TeamWorkloadSummary() {
    }

    public TeamWorkloadSummary(
            Long userId,
            String userName,
            long totalTasks,
            long completedTasks,
            long pendingTasks) {

        this.userId = userId;
        this.userName = userName;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }
}