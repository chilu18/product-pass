"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export interface FormStep {
  id: string;
  title: string;
  shortLabel: string;
  content: React.ReactNode;
}

interface FormStepCarouselProps {
  steps: FormStep[];
  footer?: React.ReactNode;
}

export default function FormStepCarousel({ steps, footer }: FormStepCarouselProps) {
  const [activeStep, setActiveStep] = useState(0);
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  const goTo = (index: number) => {
    setActiveStep(Math.max(0, Math.min(steps.length - 1, index)));
  };

  return (
    <div className="pp-card overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Step {activeStep + 1} of {steps.length}
          </p>
          <p className="truncate text-sm font-medium text-slate-600 dark:text-slate-400">
            {steps[activeStep].title}
          </p>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((step, index) => {
            const done = index < activeStep;
            const current = index === activeStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => goTo(index)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  current
                    ? "bg-emerald-600 text-white shadow-sm"
                    : done
                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                      : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    current
                      ? "bg-white/20"
                      : done
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                <span className="hidden sm:inline">{step.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="min-h-[420px] p-6 sm:p-8">
        <h2 className="pp-subheading text-xl">{steps[activeStep].title}</h2>
        <div className="mt-6">{steps[activeStep].content}</div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={() => goTo(activeStep - 1)}
          disabled={isFirst}
          className="pp-secondary-btn inline-flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-medium disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {isLast && footer}
          {!isLast && (
            <button
              type="button"
              onClick={() => goTo(activeStep + 1)}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
