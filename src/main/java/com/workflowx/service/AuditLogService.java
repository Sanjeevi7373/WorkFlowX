
package com.workflowx.service;

import com.workflowx.entity.AuditLog;
import com.workflowx.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog log(
            String action,
            String details,
            String username,
            String entityType,
            Long entityId,
            String severity) {

        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setDetails(details);
        auditLog.setUsername(username);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setSeverity(
                severity == null || severity.isBlank() ? "INFO" : severity
        );

        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll(
                org.springframework.data.domain.Sort
                        .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")
        );
    }
    
    public void logLogin(String username) {
        log(
            "LOGIN",
            "User logged in successfully",
            username,
            "AUTH",
            null,
            "INFO"
        );
    }

}
