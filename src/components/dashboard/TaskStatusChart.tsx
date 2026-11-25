import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import type { TaskStatusData } from '@/types/dashboard';

export interface TaskStatusChartProps {
  data: TaskStatusData[];
}

export const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data }) => {
  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Current task distribution</CardDescription>
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            {totalTasks} Total
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1 flex flex-col justify-between min-h-[280px]">
        {/* Donut Chart with Centered Total */}
        <div className="relative h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: unknown) => {
                  const numVal = typeof val === 'number' ? val : 0;
                  const pct = totalTasks > 0 ? ((numVal / totalTasks) * 100).toFixed(0) : '0';
                  return [`${numVal} tasks (${pct}%)`, 'Count'];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
              {totalTasks}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Tasks
            </span>
          </div>
        </div>

        {/* Custom Status Legend with Counts & Percentages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {data.map((item) => {
            const percentage = totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(0) : 0;
            return (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0 flex-1 truncate">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate block">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    {item.value} <span className="text-slate-400 font-normal">({percentage}%)</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskStatusChart;
