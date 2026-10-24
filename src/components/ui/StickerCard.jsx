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
};

export const StickerCard = ({
  children,
  tone = 'white',
  rotate = 0,
  className = '',
  shadow = 'sticker',
  as: Component = 'div',
  ...props
}) => {
  const toneBg = toneClasses[tone] || toneClasses.white;
  
  // Rotation styling (-2 to 2 deg)
  const rotationStyle = rotate
    ? { transform: `rotate(${rotate}deg)` }
    : undefined;

  const shadowClass = shadow === 'sm' ? 'shadow-sticker-sm' : shadow === 'lg' ? 'shadow-sticker-lg' : 'shadow-sticker';

  return (
    <Component
      style={{ ...rotationStyle, ...(props.style || {}) }}
      className={`border-[3px] border-ink ${toneBg} ${shadowClass} p-5 rounded-none transition-all ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default StickerCard;
