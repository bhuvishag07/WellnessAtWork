import React from 'react';

const toneClasses = {
  white: 'bg-white text-ink',
  butter: 'bg-butter text-ink',
  sage: 'bg-sage text-ink',
  peri: 'bg-peri text-ink',
  blush: 'bg-blush text-ink',
  rose: 'bg-rose text-ink',
  sticky: 'bg-sticky text-ink',
  ink: 'bg-ink text-butter',
  indigo: 'bg-indigo text-white',
};

export const Pill = ({
  children,
  tone = 'white',
  className = '',
  as: Component = 'span',
  ...props
}) => {
  const toneBg = toneClasses[tone] || toneClasses.white;

  return (
    <Component
      className={`inline-flex items-center gap-1.5 border-[3px] border-ink ${toneBg} px-2.5 py-1 text-xs font-bold font-display uppercase tracking-wider rounded-none select-none ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Pill;
