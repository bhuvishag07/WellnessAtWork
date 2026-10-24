import React from 'react';
import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'bg-rose text-ink hover:bg-[#e07f9c]',
  secondary: 'bg-white text-ink hover:bg-paper',
  dark: 'bg-ink text-butter hover:bg-[#222222]',
  hr: 'bg-indigo text-white hover:bg-[#5060a3]',
  sage: 'bg-sage text-ink hover:bg-[#97c7aa]',
  butter: 'bg-butter text-ink hover:bg-[#e6cd7d]',
};

export const StickerButton = ({
  children,
  variant = 'secondary',
  to,
  href,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const chosenVariant = variantClasses[variant] || variantClasses.secondary;

  const baseClasses = `inline-flex items-center justify-center gap-2 border-[3px] border-ink ${chosenVariant} shadow-sticker-sm font-display font-bold text-xs sm:text-sm px-4 py-2.5 rounded-none transition-transform duration-100 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus:outline-none focus:ring-3 focus:ring-indigo focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default StickerButton;
