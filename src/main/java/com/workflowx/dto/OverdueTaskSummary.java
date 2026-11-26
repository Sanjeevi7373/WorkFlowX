package com.workflowx.dto;

import java.time.LocalDate;

public class OverdueTaskSummary {

    private Long taskId;
    private String taskTitle;
    private String projectName;
    private LocalDate dueDate;
    private String priority;

    public OverdueTaskSummary() {
    }

    public OverdueTaskSummary(
            Long taskId,
            String taskTitle,
            String projectName,
            LocalDate dueDate,
            String priority) {

        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.projectName = projectName;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}