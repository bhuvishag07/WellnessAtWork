import React from 'react';

export const GlassCard = ({ 
  children, 
  className = "", 
  elevated = false, 
  tint = false, 
  interactive = false,
  onClick,
  ...props
}) => {
  let baseStyle = "border-[3px] border-ink bg-white shadow-sticker rounded-none p-5 text-left";
  if (elevated) {
    baseStyle = "border-[3px] border-ink bg-white shadow-sticker-lg rounded-none p-5 text-left";
  } else if (tint) {
    baseStyle = "border-[3px] border-ink bg-butter shadow-sticker rounded-none p-5 text-left";
  } else if (interactive) {
    baseStyle = "border-[3px] border-ink bg-white shadow-sticker rounded-none p-5 text-left transition-transform duration-100 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_#111111] cursor-pointer";
  }

  return (
    <div 
      className={`${baseStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
