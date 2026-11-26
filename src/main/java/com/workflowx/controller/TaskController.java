package com.workflowx.controller;

import com.workflowx.entity.Project;
import com.workflowx.entity.Task;
import com.workflowx.entity.User;
import com.workflowx.service.ProjectService;
import com.workflowx.service.TaskService;
import com.workflowx.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final UserService userService;

    public TaskController(TaskService taskService,
                          ProjectService projectService,
                          UserService userService) {
        this.taskService = taskService;
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        return ResponseEntity.ok(
                taskService.getTasksByUser(user)
        );
    }

    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestBody Task task,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        if (task.getProject() == null ||
                task.getProject().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Project project = projectService
                .getProjectById(task.getProject().getId())
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        task.setProject(project);

        if (task.getAssignedTo() != null &&
                task.getAssignedTo().getId() != null) {

            userService
                    .getUserById(task.getAssignedTo().getId())
                    .ifPresent(task::setAssignedTo);
        } else {
            task.setAssignedTo(user);
        }

        Task savedTask = taskService.createTask(task);

        return ResponseEntity.ok(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask) {

        return taskService.getTaskById(id)
                .map(existingTask -> {

                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setDescription(updatedTask.getDescription());
                    existingTask.setStatus(updatedTask.getStatus());
                    existingTask.setPriority(updatedTask.getPriority());
                    existingTask.setDueDate(updatedTask.getDueDate());

                    if (updatedTask.getProject() != null &&
                            updatedTask.getProject().getId() != null) {

                        projectService
                                .getProjectById(
                                        updatedTask.getProject().getId()
                                )
                                .ifPresent(existingTask::setProject);
                    }

                    if (updatedTask.getAssignedTo() != null &&
                            updatedTask.getAssignedTo().getId() != null) {

                        userService
                                .getUserById(
                                        updatedTask.getAssignedTo().getId()
                                )
                                .ifPresent(existingTask::setAssignedTo);
                    }

                    Task savedTask = taskService.updateTask(existingTask);

                    return ResponseEntity.ok(savedTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {

        if (taskService.getTaskById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        taskService.deleteTask(id);

        return ResponseEntity.ok("Task deleted successfully");
    }
}