
import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Download,
  RefreshCw,
  Search,
  AlertCircle,
} from 'lucide-react';
import api from '@/services/api';

interface AuditLog {
  id: number;
  action: string;
  details: string;
  username: string;
  entityType?: string | null;
  entityId?: number | null;
  severity: string;
  createdAt: string;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString();
};

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get<AuditLog[]>('/admin/audit-logs');
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      setError(
        err?.response?.status === 403
          ? 'Access denied. Only administrators can view audit logs.'
          : err?.response?.status === 401
            ? 'Your session may have expired. Please log in again.'
            : 'Unable to load audit logs. Check that the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const query = search.toLowerCase();

    const matchesSearch = [
      log.action,
      log.details,
      log.username,
      log.entityType ?? '',
      String(log.entityId ?? ''),
    ].some((value) => value.toLowerCase().includes(query));

    const matchesSeverity =
      severity === 'ALL' ||
      (log.severity ?? 'INFO').toUpperCase() === severity;

    return matchesSearch && matchesSeverity;
  });

  const exportCsv = () => {
    const headers = [
      'ID',
      'Action',
      'Username',
      'Details',
      'Entity Type',
      'Entity ID',
      'Severity',
      'Created At',
    ];

    const escapeCsv = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = filteredLogs.map((log) => [
      log.id,
      log.action,
      log.username,
      log.details,
      log.entityType,
      log.entityId,
      log.severity,
      log.createdAt,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflowx-audit-logs.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const criticalCount = logs.filter(
    (log) => ['ERROR', 'CRITICAL'].includes(
      (log.severity ?? '').toUpperCase()
    )
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Audit Logs
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review recorded security events and system activity.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => void fetchLogs()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            onClick={exportCsv}
            disabled={filteredLogs.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Total Events</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {logs.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Login Events</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {logs.filter((log) => log.action === 'LOGIN').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Error / Critical Events</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {criticalCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <CardTitle>System Activity & Security Events</CardTitle>
          </div>
          <CardDescription>
            Audit records retrieved from the protected
            {' '}/api/admin/audit-logs endpoint.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search action, user, details..."
                className="w-full rounded-md border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="ALL" className="bg-slate-900 text-white">All severities </option>
              <option value="INFO" className="bg-slate-900 text-white">Info</option>
              <option value="WARNING" className="bg-slate-900 text-white">Warning</option>
              <option value="ERROR" className="bg-slate-900 text-white">Error</option>
              <option value="CRITICAL" className="bg-slate-900 text-white">Critical</option>
            </select>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Loading audit logs...
            </p>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-medium text-slate-700">
                {logs.length === 0
                  ? 'No audit events recorded yet'
                  : 'No matching audit events'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {logs.length === 0
                  ? 'Successful logins will appear here once recorded.'
                  : 'Try changing your search or severity filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700/70 transition-colors hover:bg-slate-800/60">
                    <th className="px-3 py-3">Event</th>
                    <th className="px-3 py-3">User</th>
                    <th className="px-3 py-3">Details</th>
                    <th className="px-3 py-3">Entity</th>
                    <th className="px-3 py-3">Severity</th>
                    <th className="px-3 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-700/70 hover:bg-slate-800/60"
                    >
                      <td className="px-3 py-4 font-medium text-white">
                        {log.action}
                        <p className="mt-1 text-xs text-slate-400">
                          #{log.id}
                        </p>
                      </td>
                      <td className="px-3 py-4 text-slate-200">
                        {log.username}
                      </td>
                      <td className="max-w-xs whitespace-normal px-3 py-4 text-slate-300">
                        {log.details}
                      </td>
                      <td className="px-3 py-4 text-slate-300">
                        {log.entityType || '—'}
                        {log.entityId != null && ` #${log.entityId}`}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            log.severity === 'CRITICAL' ||
                            log.severity === 'ERROR'
                              ? 'bg-red-100 text-red-700'
                              : log.severity === 'WARNING'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {log.severity || 'INFO'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pt-3 text-xs text-slate-400">
                Showing {filteredLogs.length} of {logs.length} events
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLogsPage;
