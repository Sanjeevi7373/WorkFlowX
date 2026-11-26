package com.workflowx.controller;

import com.workflowx.entity.Team;
import com.workflowx.entity.User;
import com.workflowx.service.TeamService;
import com.workflowx.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final UserService userService;

    public TeamController(TeamService teamService,
                          UserService userService) {
        this.teamService = teamService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Team> createTeam(
            @RequestBody Team team) {

        if (team.getManager() != null &&
                team.getManager().getId() != null) {

            User manager = userService
                    .getUserById(team.getManager().getId())
                    .orElseThrow(() ->
                            new RuntimeException("Manager not found"));

            team.setManager(manager);
        }

        Team savedTeam = teamService.createTeam(team);

        return ResponseEntity.ok(savedTeam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(
            @PathVariable Long id,
            @RequestBody Team updatedTeam) {

        return teamService.getTeamById(id)
                .map(existingTeam -> {

                    existingTeam.setName(updatedTeam.getName());
                    existingTeam.setDescription(updatedTeam.getDescription());
                    existingTeam.setStatus(updatedTeam.getStatus());

                    if (updatedTeam.getManager() != null &&
                            updatedTeam.getManager().getId() != null) {

                        userService
                                .getUserById(
                                        updatedTeam.getManager().getId()
                                )
                                .ifPresent(existingTeam::setManager);
                    }

                    Team savedTeam =
                            teamService.updateTeam(existingTeam);

                    return ResponseEntity.ok(savedTeam);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeam(@PathVariable Long id) {

        if (teamService.getTeamById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        teamService.deleteTeam(id);

        return ResponseEntity.ok("Team deleted successfully");
    }
}