package com.workflowx.service;

import com.workflowx.entity.Project;
import com.workflowx.entity.User;
import com.workflowx.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByUser(User user) {
        return projectRepository.findByCreatedBy(user);
    }

    public List<Project> getProjectsByStatus(Project.ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public List<Project> getProjectsByPriority(Project.ProjectPriority priority) {
        return projectRepository.findByPriority(priority);
    }

    public Project updateProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}