import React from 'react';

export default function Badge({ children, variant = 'sage', size = 'md', className = '' }) {
  const variants = {
    sage:   'bg-[#05140b]/70 backdrop-blur-md text-sage border border-sage/40',
    forest: 'bg-pine text-cream border border-white/20',
    stone:  'bg-white/10 backdrop-blur-md text-soil border border-white/15',
    white:  'bg-[#05140b]/78 backdrop-blur-md text-cream border border-white/20',
    dark:   'bg-[#041008]/85 backdrop-blur-md text-cream border border-white/15',
    fern:   'bg-fern/80 backdrop-blur-md text-cream border border-white/20',
    gold:   'bg-[#05140b]/75 backdrop-blur-md text-sage border border-sage/40',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold tracking-wider uppercase rounded select-none ${variants[variant] || variants.sage} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
}
