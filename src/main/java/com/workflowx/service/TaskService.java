package com.workflowx.service;

import com.workflowx.entity.Project;
import com.workflowx.entity.Task;
import com.workflowx.entity.User;
import com.workflowx.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByProject(Project project) {
        return taskRepository.findByProject(project);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByAssignedTo(user);
    }

    public List<Task> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByPriority(Task.TaskPriority priority) {
        return taskRepository.findByPriority(priority);
    }


    public Task updateTask(Task task) {

        Task existingTask = taskRepository.findById(task.getId())
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        boolean isAdmin =
                authentication.getAuthorities().stream()
                        .anyMatch(authority ->
                                authority.getAuthority().equals("ROLE_ADMIN"));

        boolean isManager =
                authentication.getAuthorities().stream()
                        .anyMatch(authority ->
                                authority.getAuthority().equals("ROLE_MANAGER"));

        if (!isAdmin && !isManager) {

            User assignedUser = existingTask.getAssignedTo();

            if (assignedUser == null
                    || !assignedUser.getEmail().equals(email)) {

throw new AccessDeniedException(
        "You can only update tasks assigned to you"
);
            }
        }

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setStatus(task.getStatus());
        existingTask.setPriority(task.getPriority());
        existingTask.setDueDate(task.getDueDate());

        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}