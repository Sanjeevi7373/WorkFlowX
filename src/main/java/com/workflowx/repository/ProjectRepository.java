package com.workflowx.repository;

import com.workflowx.entity.Project;
import com.workflowx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCreatedBy(User user);

    List<Project> findByStatus(Project.ProjectStatus status);

    List<Project> findByPriority(Project.ProjectPriority priority);
}