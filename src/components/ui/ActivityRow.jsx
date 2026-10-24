import React from 'react';

export const ActivityRow = ({
  title,
  subtitle,
  meta,
  points,
  pointsPrefix = '+',
  pointsSuffix = '',
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`border-t-[2px] border-dashed border-ink/40 pt-3 flex items-center justify-between gap-3 text-left ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="w-8 h-8 border-2 border-ink bg-white flex items-center justify-center flex-shrink-0 text-ink">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold text-ink truncate leading-tight">
            {title}
          </p>
          {(subtitle || meta) && (
            <p className="text-[11px] text-muted font-medium truncate mt-0.5 leading-tight">
              {subtitle || meta}
            </p>
          )}
        </div>
      </div>

      {points !== undefined && (
        <span className="flex-shrink-0 bg-sage text-ink border-2 border-ink px-2 py-0.5 text-xs font-bold font-display tabular-nums shadow-[1px_1px_0_#111]">
          {pointsPrefix}{points}{pointsSuffix}
        </span>
      )}
    </div>
  );
};

export default ActivityRow;
