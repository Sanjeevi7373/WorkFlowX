import React from 'react';
import { CheckCircle2, GitCommit, ArrowRight, Activity } from 'lucide-react';

export const AuthBranding: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full p-8 lg:p-12 text-white">
      {/* Top Logo & Title */}
      <div>
        <div className="flex items-center gap-3">
          <img
            src="/workflowx-logo.png"
            alt="WorkflowX"
            className="h-10 sm:h-11 w-auto max-w-full object-contain object-left"
          />
          <span className="h-4 w-px bg-slate-800" />
          <p className="text-xs font-medium text-slate-400">
            Work Management
          </p>
        </div>

        {/* Main Headlines */}
        <div className="mt-12 lg:mt-16 max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Manage work.
            <br />
            <span className="text-indigo-400">Empower teams.</span>
            <br />
            Deliver faster.
          </h1>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-md">
            WorkFlowX brings projects, tasks, teams and operations together in one intelligent enterprise workspace.
          </p>
        </div>
      </div>

      {/* Abstract Workflow Graphic (Pure CSS & Components) */}
      <div className="my-8 hidden sm:block">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xs max-w-md">
          {/* Subtle Grid Accent */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">Pipeline Velocity</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Operations
            </span>
          </div>

          {/* Workflow Sequence Pipeline */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <GitCommit className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">Sprint Backlog & Planning</p>
                  <p className="text-[10px] text-slate-400">14 stories assigned</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">Active Execution Phase</p>
                  <p className="text-[10px] text-slate-400">8 tasks in progress</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            </div>

            {/* Step 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">Continuous Delivery</p>
                  <p className="text-[10px] text-emerald-400">Automated QA passed</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                100%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-xs text-slate-400 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span>WorkFlowX Platform v1.0</span>
        <span>Enterprise Edition</span>
      </div>
    </div>
  );
};

export default AuthBranding;
