import * as React from 'react';
import { cn } from '@/lib/utils';

interface AdminPageProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPage({ children, className }: AdminPageProps) {
  return (
    <div className={cn('min-w-0 px-4 py-6 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
    </div>
  );
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--white-2)] truncate">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--light-gray-70)]">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

interface AdminPageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPageSection({ children, className }: AdminPageSectionProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--jet)] bg-[var(--eerie-black-2)] p-4 sm:p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
