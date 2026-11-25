import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  description?: string;
  changeDescription?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  isInverseTrend?: boolean; // When true, negative change is good (e.g., fewer overdue tasks)
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  description,
  changeDescription,
  icon: Icon,
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/50',
  isInverseTrend = false,
}) => {
  const comparisonText = description || changeDescription || (change !== undefined ? 'vs last week' : undefined);
  const hasChange = typeof change === 'number';
  const isPositiveChange = hasChange ? change > 0 : false;
  const isGood = isInverseTrend ? !isPositiveChange : isPositiveChange;
  const formattedChange = hasChange ? `${change > 0 ? '+' : ''}${change}%` : '';

  return (
    <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-normal">
            {title}
          </span>
          <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>

          {(hasChange || comparisonText) && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap text-xs">
              {hasChange && (
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                    isGood
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60'
                  }`}
                >
                  {isPositiveChange ? (
                    <ArrowUpRight className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 shrink-0" />
                  )}
                  <span>{formattedChange}</span>
                </span>
              )}

              {comparisonText && (
                <span className="text-slate-400 dark:text-slate-500 font-medium">
                  {comparisonText}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
