package com.workflowx.repository;

import com.workflowx.entity.Task;
import com.workflowx.entity.Project;
import com.workflowx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignedTo(User user);

    List<Task> findByStatus(Task.TaskStatus status);

    List<Task> findByPriority(Task.TaskPriority priority);
    List<Task> findByDueDateIsNotNullAndDueDateBefore(
            LocalDate date
    );
    List<Task> findByDueDateIsNotNullAndDueDateGreaterThanEqualAndDueDateLessThanEqual(
            LocalDate startDate,
            LocalDate endDate
    );
    @Query("""
            SELECT COUNT(t)
            FROM Task t
            WHERE t.createdAt >= :start
            AND t.createdAt < :end
        """)
    long countTasksCreatedBetween(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.status = :status
        AND t.updatedAt >= :start
        AND t.updatedAt < :end
        """)
long countTasksCompletedBetween(
        @Param("status") Task.TaskStatus status,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
);
}