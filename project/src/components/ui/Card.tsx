import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
  compact?: boolean;
}

export function KPICard({ title, value, icon, color = 'bg-blue-500', subtitle, compact = false }: KPICardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center hover:shadow-md transition-shadow ${
        compact ? 'p-3 gap-2.5' : 'p-5 gap-4'
      }`}
    >
      <div className={`${color} ${compact ? 'p-2 rounded-lg' : 'p-3 rounded-xl'} text-white flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide truncate">{title}</p>
        <p className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 dark:text-gray-100 mt-0.5`}>{value}</p>
        {subtitle && <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function Card({ title, children, className = '', action, compact = false }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
      {(title || action) && (
        <div className={`flex items-center justify-between border-b border-gray-100 dark:border-gray-800 ${compact ? 'px-3 py-2.5' : 'px-5 py-4'}`}>
          {title && <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={compact ? 'p-3' : 'p-5'}>{children}</div>
    </div>
  );
}
