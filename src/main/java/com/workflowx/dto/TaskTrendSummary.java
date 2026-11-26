package com.workflowx.dto;

import java.time.LocalDate;

public class TaskTrendSummary {

    private LocalDate date;
    private long tasksCreated;
    private long tasksCompleted;

    public TaskTrendSummary() {
    }

    public TaskTrendSummary(
            LocalDate date,
            long tasksCreated,
            long tasksCompleted) {
        this.date = date;
        this.tasksCreated = tasksCreated;
        this.tasksCompleted = tasksCompleted;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public long getTasksCreated() {
        return tasksCreated;
    }

    public void setTasksCreated(long tasksCreated) {
        this.tasksCreated = tasksCreated;
    }

    public long getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(long tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }
}