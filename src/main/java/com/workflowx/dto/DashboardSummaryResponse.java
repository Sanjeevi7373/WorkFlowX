package com.workflowx.dto;

public class DashboardSummaryResponse {

    private long totalProjects;
    private long activeProjects;
    private long completedProjects;

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;

    private long totalTeams;

    private long unreadNotifications;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(
            long totalProjects,
            long activeProjects,
            long completedProjects,
            long totalTasks,
            long completedTasks,
            long pendingTasks,
            long totalTeams,
            long unreadNotifications) {

        this.totalProjects = totalProjects;
        this.activeProjects = activeProjects;
        this.completedProjects = completedProjects;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.totalTeams = totalTeams;
        this.unreadNotifications = unreadNotifications;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(long completedProjects) {
        this.completedProjects = completedProjects;
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

    public long getTotalTeams() {
        return totalTeams;
    }

    public void setTotalTeams(long totalTeams) {
        this.totalTeams = totalTeams;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }

    public void setUnreadNotifications(long unreadNotifications) {
        this.unreadNotifications = unreadNotifications;
    }
}