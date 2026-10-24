import React from 'react';

export const Label = ({
  children,
  className = '',
  as: Component = 'span',
  ...props
}) => {
  return (
    <Component
      className={`font-display text-[12px] font-bold uppercase tracking-[0.1em] text-ink block ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Label;
