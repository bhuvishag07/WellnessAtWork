import React from 'react';

export const Badge = ({ children, variant = "lilac", size = "md", className = "" }) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-bold",
    md: "px-2.5 py-1 text-xs font-bold",
    lg: "px-3 py-1.5 text-sm font-bold"
  };

  const variantStyles = {
    lilac: "bg-butter text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    active: "bg-rose text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    joined: "bg-sage text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    completed: "bg-peri text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    confidential: "bg-butter text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    rank: "bg-peri text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    glass: "bg-white text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    danger: "bg-rose text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    sage: "bg-sage text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    peri: "bg-peri text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
    blush: "bg-blush text-ink border-[2px] border-ink shadow-[2px_2px_0_#111]",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-none font-display uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.lilac} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
