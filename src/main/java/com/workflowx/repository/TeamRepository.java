package com.workflowx.repository;

import com.workflowx.entity.Team;
import com.workflowx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByManager(User manager);

    List<Team> findByStatus(Team.TeamStatus status);

}