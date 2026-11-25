import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Main App Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProjectsPage } from '@/pages/projects/ProjectsPage';
import { ProjectDetailsPage } from '@/pages/projects/ProjectDetailsPage';
import { TasksPage } from '@/pages/tasks/TasksPage';
import { TeamPage } from '@/pages/team/TeamPage';
import { CalendarPage } from '@/pages/calendar/CalendarPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { ProfilePage } from '@/pages/settings/ProfilePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

// Admin Pages
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminTeamsPage } from '@/pages/admin/AdminTeamsPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';

// 404
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect to Dashboard */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Main SaaS Operations Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Administration Routes */}
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/teams" element={<AdminTeamsPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
