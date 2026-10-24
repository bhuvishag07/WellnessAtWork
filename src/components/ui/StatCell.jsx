import React from 'react';

export const StatCell = ({
  label,
  value,
  subline,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 text-left ${className}`} {...props}>
      {label && (
        <span className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-ink block leading-none">
          {label}
        </span>
      )}

      <div className="text-[36px] sm:text-[40px] font-display font-bold tracking-tight text-ink tabular-nums leading-none pt-1">
        {value}
      </div>

      {subline && (
        <p className="text-xs text-ink/80 font-medium leading-snug pt-1">
          {subline}
        </p>
      )}

      {footer && (
        <div className="text-xs font-bold text-ink leading-snug pt-0.5">
          {footer}
        </div>
      )}
    </div>
  );
};

export default StatCell;
