import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = 'positive',
  color = 'purple',
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          hoverBorder: 'hover:border-emerald-500/30',
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          hoverBorder: 'hover:border-blue-500/30',
        };
      case 'orange':
        return {
          iconBg: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          hoverBorder: 'hover:border-orange-500/30',
        };
      case 'purple':
      default:
        return {
          iconBg: 'bg-brand-accent-bg text-brand-accent border-brand-accent-border',
          hoverBorder: 'hover:border-brand-accent/30',
        };
    }
  };

  const styles = getColorStyles();

  return (
    <div className={`p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md ${styles.hoverBorder}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-brand-text/75 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-brand-heading mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${styles.iconBg}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full ${
              trendType === 'positive'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : trendType === 'negative'
                ? 'bg-rose-500/10 text-rose-650 dark:text-rose-450'
                : 'bg-brand-code/80 text-brand-text'
            }`}
          >
            {trend}
          </span>
          <span className="text-brand-text/60">vs last month</span>
        </div>
      )}
    </div>
  );
};
