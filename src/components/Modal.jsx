import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-md"
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Flat backdrop (no blur) */}
      <div 
        className="fixed inset-0 bg-ink/60 transition-opacity"
        onClick={onClose}
      />

      {/* Sticker brutalist dialog */}
      <div className={`relative w-full ${maxWidth} border-[4px] border-ink bg-white shadow-sticker-lg p-6 sm:p-7 z-10 rounded-none text-left`}>
        <div className="flex items-start justify-between pb-3 border-b-[3px] border-ink">
          <div>
            <h3 className="text-xl font-display font-bold text-ink">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-ink bg-white text-ink hover:bg-rose transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="mt-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
