import React from 'react';

export const ProgressBar = ({
  progress = 0,
  max = 100,
  className = '',
  fillColor = 'bg-rose',
  showBorderOnFill = true,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (progress / max) * 100));

  return (
    <div
      className={`h-[34px] border-[3px] border-ink bg-white relative overflow-hidden rounded-none ${className}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      <div
        className={`${fillColor} h-full transition-all duration-500 ease-out ${
          showBorderOnFill && percentage > 0 && percentage < 100 ? 'border-r-[3px] border-ink' : ''
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
