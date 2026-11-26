package com.workflowx.service;

import com.workflowx.entity.Team;
import com.workflowx.entity.User;
import com.workflowx.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }

    public List<Team> getTeamsByManager(User manager) {
        return teamRepository.findByManager(manager);
    }

    public List<Team> getTeamsByStatus(Team.TeamStatus status) {
        return teamRepository.findByStatus(status);
    }

    public Team updateTeam(Team team) {
        return teamRepository.save(team);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}