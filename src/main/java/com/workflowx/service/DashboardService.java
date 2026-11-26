package com.workflowx.service;

import com.workflowx.dto.DashboardSummaryResponse;
import com.workflowx.dto.ProjectProgressSummary;
import com.workflowx.dto.TaskStatusSummary;
import com.workflowx.dto.UpcomingDeadlineSummary;
import com.workflowx.entity.Notification;
import com.workflowx.entity.Project;
import com.workflowx.entity.Task;
import com.workflowx.repository.NotificationRepository;
import com.workflowx.repository.ProjectRepository;
import com.workflowx.repository.TaskRepository;
import com.workflowx.repository.TeamRepository;
import com.workflowx.dto.TeamWorkloadSummary;
import com.workflowx.repository.UserRepository;
import com.workflowx.entity.User;
import com.workflowx.dto.RecentActivitySummary;
import com.workflowx.dto.OverdueTaskSummary;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.workflowx.dto.TaskTrendSummary;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public DashboardService(
        ProjectRepository projectRepository,
        TaskRepository taskRepository,
        TeamRepository teamRepository,
        NotificationRepository notificationRepository,
        UserRepository userRepository) {

        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    public List<TaskStatusSummary> getTaskStatusSummary() {

        List<TaskStatusSummary> summary = new ArrayList<>();

        for (Task.TaskStatus status : Task.TaskStatus.values()) {

            long count = taskRepository
                    .findByStatus(status)
                    .size();

            summary.add(
                    new TaskStatusSummary(
                            status.name(),
                            count
                    )
            );
        }

        return summary;
    }

    public DashboardSummaryResponse getDashboardSummary() {

        long totalProjects = projectRepository.count();

        long activeProjects = projectRepository
                .findByStatus(Project.ProjectStatus.IN_PROGRESS)
                .size();

        long completedProjects = projectRepository
                .findByStatus(Project.ProjectStatus.COMPLETED)
                .size();

        long totalTasks = taskRepository.count();

        long completedTasks = taskRepository
                .findByStatus(Task.TaskStatus.COMPLETED)
                .size();

        long pendingTasks =
                taskRepository.findByStatus(Task.TaskStatus.TODO).size()
                + taskRepository.findByStatus(Task.TaskStatus.IN_PROGRESS).size()
                + taskRepository.findByStatus(Task.TaskStatus.REVIEW).size();

        long totalTeams = teamRepository.count();

        long unreadNotifications = notificationRepository
                .findAll()
                .stream()
                .filter(notification ->
                        notification.getStatus()
                                == Notification.NotificationStatus.UNREAD)
                .count();

        return new DashboardSummaryResponse(
                totalProjects,
                activeProjects,
                completedProjects,
                totalTasks,
                completedTasks,
                pendingTasks,
                totalTeams,
                unreadNotifications
        );
    }
    public List<ProjectProgressSummary> getProjectProgressSummary() {

        List<ProjectProgressSummary> summary = new ArrayList<>();

        List<Project> projects = projectRepository.findAll();

        for (Project project : projects) {

                List<Task> tasks = taskRepository.findByProject(project);

                long totalTasks = tasks.size();

                long completedTasks = tasks.stream()
                        .filter(task ->
                                task.getStatus() == Task.TaskStatus.COMPLETED)
                        .count();

                int progress = totalTasks == 0
                        ? 0
                        : (int) Math.round(
                                (completedTasks * 100.0) / totalTasks
                        );

                summary.add(
                        new ProjectProgressSummary(
                                project.getId(),
                                project.getName(),
                                totalTasks,
                                completedTasks,
                                progress
                        )
                );
        }
        return summary;
    }
    public List<UpcomingDeadlineSummary> getUpcomingDeadlines() {

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysFromNow = today.plusDays(7);

        List<Task> tasks =
                taskRepository
                        .findByDueDateIsNotNullAndDueDateGreaterThanEqualAndDueDateLessThanEqual(
                                today,
                                sevenDaysFromNow
                        );

        return tasks.stream()
                .filter(task ->
                        task.getStatus() != Task.TaskStatus.COMPLETED
                        && task.getStatus() != Task.TaskStatus.CANCELLED
                )
                .sorted((t1, t2) -> t1.getDueDate().compareTo(t2.getDueDate()))
                .map(task ->
                        new UpcomingDeadlineSummary(
                                task.getId(),
                                task.getTitle(),
                                task.getProject().getName(),
                                task.getDueDate(),
                                task.getPriority().name()
                        )
                )
                .toList();
    }
    public List<TeamWorkloadSummary> getTeamWorkloadSummary() {

        List<TeamWorkloadSummary> summary = new ArrayList<>();

        List<User> users = userRepository.findAll();

        for (User user : users) {

                List<Task> tasks = taskRepository.findByAssignedTo(user);

                long totalTasks = tasks.size();

                long completedTasks = tasks.stream()
                        .filter(task ->
                                task.getStatus() == Task.TaskStatus.COMPLETED)
                        .count();

                long pendingTasks = tasks.stream()
                        .filter(task ->
                                task.getStatus() != Task.TaskStatus.COMPLETED
                                && task.getStatus() != Task.TaskStatus.CANCELLED)
                        .count();

                String userName =
                        user.getFirstName() + " " + user.getLastName();

                summary.add(
                        new TeamWorkloadSummary(
                                user.getId(),
                                userName.trim(),
                                totalTasks,
                                completedTasks,
                                pendingTasks
                        )
                );
        }

        return summary;
    }
    public List<RecentActivitySummary> getRecentActivity() {

        List<RecentActivitySummary> activities = new ArrayList<>();

        List<Notification> notifications =
                notificationRepository.findAll();

        notifications.stream()
                .sorted(
                        (a, b) -> {
                                if (a.getCreatedAt() == null
                                        && b.getCreatedAt() == null) {
                                return 0;
                                }

                                if (a.getCreatedAt() == null) {
                                return 1;
                                }

                                if (b.getCreatedAt() == null) {
                                return -1;
                                }

                                return b.getCreatedAt()
                                        .compareTo(a.getCreatedAt());
                        }
                )
                .limit(10)
                .forEach(notification -> {

                        User user = notification.getUser();

                        String userName = user.getFirstName();

                        if (user.getLastName() != null
                                && !user.getLastName().isBlank()) {
                        userName += " " + user.getLastName();
                        }

                        activities.add(
                                new RecentActivitySummary(
                                        notification.getId(),
                                        notification.getType().name(),
                                        notification.getMessage(),
                                        userName,
                                        notification.getCreatedAt()
                                )
                        );
                });

        return activities;
    }
    public List<OverdueTaskSummary> getOverdueTasks() {

        LocalDate today = LocalDate.now();

        List<Task> tasks =
                taskRepository.findByDueDateIsNotNullAndDueDateBefore(today);

        return tasks.stream()
                .filter(task ->
                        task.getStatus() != Task.TaskStatus.COMPLETED
                        && task.getStatus() != Task.TaskStatus.CANCELLED
                )
                .sorted((t1, t2) -> t1.getDueDate().compareTo(t2.getDueDate()))
                .map(task ->
                        new OverdueTaskSummary(
                                task.getId(),
                                task.getTitle(),
                                task.getProject().getName(),
                                task.getDueDate(),
                                task.getPriority().name()
                        )
                )
                .toList();
    }
    public List<TaskTrendSummary> getTaskTrendSummary() {

        List<TaskTrendSummary> summary = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);

        for (int i = 0; i < 7; i++) {

                LocalDate date = startDate.plusDays(i);

                LocalDateTime start = date.atStartOfDay();
                LocalDateTime end = date.plusDays(1).atStartOfDay();

                long tasksCreated =
                        taskRepository.countTasksCreatedBetween(start, end);

                long tasksCompleted =
                        taskRepository.countTasksCompletedBetween(
                                Task.TaskStatus.COMPLETED,
                                start,
                                end
                        );

                summary.add(
                        new TaskTrendSummary(
                                date,
                                tasksCreated,
                                tasksCompleted
                        )
                );
        }

        return summary;
    }
}