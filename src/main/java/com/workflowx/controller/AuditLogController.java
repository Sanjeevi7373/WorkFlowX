
package com.workflowx.controller;

import com.workflowx.entity.AuditLog;
import com.workflowx.service.AuditLogService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<AuditLog> getAllLogs() {
        return auditLogService.getAllLogs();
    }
}
