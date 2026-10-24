import React from 'react';

const toneClasses = {
  white: 'bg-white',
  butter: 'bg-butter',
  sage: 'bg-sage',
  peri: 'bg-peri',
  blush: 'bg-blush',
  rose: 'bg-rose',
  sticky: 'bg-sticky',
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  badgeText,
  onClick,
  tone = 'white',
  className = ""
}) => {
  const bg = toneClasses[tone] || toneClasses.white;

  return (
    <div 
      onClick={onClick}
      className={`border-[3px] border-ink ${bg} shadow-sticker rounded-none p-5 text-left relative transition-transform duration-100 ease-out ${
        onClick ? 'hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_#111111] cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-ink block leading-none">
            {title}
          </span>
          <div className="text-[44px] sm:text-[48px] font-display font-bold tracking-tight text-ink tabular-nums leading-none pt-2">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="w-9 h-9 border-2 border-ink bg-white flex items-center justify-center text-ink flex-shrink-0 shadow-[2px_2px_0_#111111]">
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-ink/80 font-medium mt-2 leading-snug">
          {subtitle}
        </p>
      )}

      {badgeText && (
        <div className="mt-3 pt-2 border-t-[2px] border-dashed border-ink/30 flex items-center justify-between text-xs font-bold text-ink">
          <span>{badgeText}</span>
          {trend && (
            <span className="text-[11px] font-display uppercase tracking-wider bg-white/70 px-1.5 py-0.5 border border-ink">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
