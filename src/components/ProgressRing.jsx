import React from 'react';

export const ProgressRing = ({
  radius = 80,
  stroke = 14,
  progress = 85,
  points = 850,
  targetPoints = 1000,
  tier = "Silver Pioneer",
  className = ""
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          stroke="#111111"
          fill="#FFFFFF"
          strokeWidth={stroke + 4}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#F6EFDD"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Animated Progress Arc: rose fill */}
        <circle
          stroke="#E58FA9"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="font-display tabular-nums text-3xl font-bold text-ink tracking-tight">
          {points}
        </span>
        <span className="font-display text-[10px] font-bold uppercase tracking-wider text-ink/70">
          Total Points
        </span>
        <span className="font-display text-[11px] font-bold text-ink mt-0.5 tabular-nums">
          {progress}% to Gold
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
