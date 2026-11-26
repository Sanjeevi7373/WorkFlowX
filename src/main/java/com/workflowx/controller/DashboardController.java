package com.workflowx.controller;

import com.workflowx.dto.TaskStatusSummary;
import java.util.List;
import com.workflowx.dto.DashboardSummaryResponse;
import com.workflowx.dto.UpcomingDeadlineSummary;
import com.workflowx.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.workflowx.dto.ProjectProgressSummary;
import com.workflowx.dto.TeamWorkloadSummary;
import com.workflowx.dto.OverdueTaskSummary;
import com.workflowx.dto.TaskTrendSummary;
import com.workflowx.dto.RecentActivitySummary;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/task-status")
    public ResponseEntity<List<TaskStatusSummary>> getTaskStatusSummary() {

        return ResponseEntity.ok(
                dashboardService.getTaskStatusSummary()
        );
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary() {

        DashboardSummaryResponse summary =
                dashboardService.getDashboardSummary();

        return ResponseEntity.ok(summary);
    }
    @GetMapping("/project-progress")
    public ResponseEntity<List<ProjectProgressSummary>> getProjectProgressSummary() {

        return ResponseEntity.ok(
                dashboardService.getProjectProgressSummary()
        );
    }
    @GetMapping("/upcoming-deadlines")
    public ResponseEntity<List<UpcomingDeadlineSummary>> getUpcomingDeadlines() {

        return ResponseEntity.ok(
                dashboardService.getUpcomingDeadlines()
        );
    }
    @GetMapping("/team-workload")
    public ResponseEntity<List<TeamWorkloadSummary>> getTeamWorkloadSummary() {

        return ResponseEntity.ok(
                dashboardService.getTeamWorkloadSummary()
        );
    }
    @GetMapping("/recent-activity")
    public ResponseEntity<List<RecentActivitySummary>> getRecentActivity() {

        return ResponseEntity.ok(
                dashboardService.getRecentActivity()
        );
    }
    @GetMapping("/overdue-tasks")
    public ResponseEntity<List<OverdueTaskSummary>> getOverdueTasks() {
        return ResponseEntity.ok(
                dashboardService.getOverdueTasks()
        );
    }
    @GetMapping("/task-trend")
public ResponseEntity<List<TaskTrendSummary>> getTaskTrendSummary() {
    return ResponseEntity.ok(
            dashboardService.getTaskTrendSummary()
    );
}
}