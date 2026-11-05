import React from 'react';

export default function Badge({ children, variant = 'sage', size = 'md', className = '' }) {
  const variants = {
    sage:   'bg-sage/20 text-pine border border-sage/40',
    forest: 'bg-pine text-cream border border-pine/40',
    stone:  'bg-beige text-soil border border-bark/20',
    white:  'bg-cream text-soil border border-bark/20',
    dark:   'bg-soil text-cream border border-soil/40',
    fern:   'bg-fern/20 text-pine border border-fern/30',
    gold:   'bg-fern/20 text-pine border border-fern/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full select-none ${variants[variant] || variants.sage} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
}
