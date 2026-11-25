import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, ArrowRight, Calendar, Folder } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { MyTaskData } from '@/types/dashboard';

export interface MyTasksProps {
  tasks: MyTaskData[];
}

export const MyTasks: React.FC<MyTasksProps> = ({ tasks }) => {
  const navigate = useNavigate();

  const getPriorityBadge = (priority: MyTaskData['priority']) => {
    switch (priority) {
      case 'Critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'High':
        return <Badge variant="warning">High</Badge>;
      case 'Medium':
        return <Badge variant="info">Medium</Badge>;
      case 'Low':
      default:
        return <Badge variant="default">Low</Badge>;
    }
  };

  const getStatusBadge = (status: MyTaskData['status']) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'In Progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'Review':
        return <Badge variant="warning">Review</Badge>;
      case 'Overdue':
        return <Badge variant="danger">Overdue</Badge>;
      case 'TODO':
      default:
        return <Badge variant="default">TODO</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Items assigned to you requiring active progress</CardDescription>
          </div>
        </div>
        <Link
          to="/tasks"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>View all tasks</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th scope="col" className="py-3 px-4 sm:px-6">Task</th>
                <th scope="col" className="py-3 px-4">Project</th>
                <th scope="col" className="py-3 px-4">Priority</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4">Due Date</th>
                <th scope="col" className="py-3 px-4 text-right pr-6">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate('/tasks')}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                    {task.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Folder className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{task.project}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(task.status)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{task.dueDate}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6 min-w-[120px]">
                    <div className="flex items-center justify-end gap-2">
                      <ProgressBar
                        value={task.progress}
                        variant={task.progress === 100 ? 'success' : 'indigo'}
                        size="xs"
                        className="w-16"
                      />
                      <span className="tabular-nums font-semibold text-[11px] text-slate-600 dark:text-slate-400 w-8 text-right">
                        {task.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyTasks;
