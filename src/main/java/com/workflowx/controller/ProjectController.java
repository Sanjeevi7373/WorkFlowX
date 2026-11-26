package com.workflowx.controller;

import com.workflowx.entity.Project;
import com.workflowx.entity.Team;
import com.workflowx.entity.User;
import com.workflowx.service.ProjectService;
import com.workflowx.service.TeamService;
import com.workflowx.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;
    private final TeamService teamService;

    public ProjectController(
            ProjectService projectService,
            UserService userService,
            TeamService teamService) {

        this.projectService = projectService;
        this.userService = userService;
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id) {

        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProject(
            @RequestBody Project project,
            Authentication authentication) {

        String email = authentication.getName();

        User creator = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        project.setCreatedBy(creator);

        // Resolve the selected manager
        if (project.getManager() != null
                && project.getManager().getId() != null) {

            Long managerId = project.getManager().getId();

            User manager = userService.getUserById(managerId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Project manager not found: " + managerId));

            project.setManager(manager);
        } else {
            return ResponseEntity.badRequest()
                    .body("Please select a project manager.");
        }

        // Resolve the selected team
        if (project.getTeam() != null
                && project.getTeam().getId() != null) {

            Long teamId = project.getTeam().getId();

            Team team = teamService.getTeamById(teamId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Team not found: " + teamId));

            project.setTeam(team);
        } else {
            return ResponseEntity.badRequest()
                    .body("Please select a team.");
        }

        Project savedProject =
                projectService.createProject(project);

        return ResponseEntity.ok(savedProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(
            @PathVariable Long id,
            @RequestBody Project updatedProject) {

        return projectService.getProjectById(id)
                .map(existingProject -> {

                    existingProject.setName(updatedProject.getName());
                    existingProject.setDescription(
                            updatedProject.getDescription());
                    existingProject.setStatus(updatedProject.getStatus());
                    existingProject.setPriority(
                            updatedProject.getPriority());
                    existingProject.setStartDate(
                            updatedProject.getStartDate());
                    existingProject.setEndDate(
                            updatedProject.getEndDate());

                    if (updatedProject.getManager() != null
                            && updatedProject.getManager().getId() != null) {

                        userService.getUserById(
                                updatedProject.getManager().getId()
                        ).ifPresent(existingProject::setManager);
                    }

                    if (updatedProject.getTeam() != null
                            && updatedProject.getTeam().getId() != null) {

                        teamService.getTeamById(
                                updatedProject.getTeam().getId()
                        ).ifPresent(existingProject::setTeam);
                    }

                    Project savedProject =
                            projectService.updateProject(existingProject);

                    return ResponseEntity.ok(savedProject);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(
            @PathVariable Long id) {

        if (projectService.getProjectById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        projectService.deleteProject(id);

        return ResponseEntity.ok("Project deleted successfully");
    }
}