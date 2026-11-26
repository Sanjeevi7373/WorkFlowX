package com.workflowx.dto;

public class ProjectProgressSummary {

    private Long projectId;
    private String projectName;
    private long totalTasks;
    private long completedTasks;
    private int progress;

    public ProjectProgressSummary() {
    }

    public ProjectProgressSummary(
            Long projectId,
            String projectName,
            long totalTasks,
            long completedTasks,
            int progress) {

        this.projectId = projectId;
        this.projectName = projectName;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.progress = progress;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
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

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }
}