import React from 'react';

export default function Badge({
  children,
  variant = 'gold',
  size = 'md',
  className = ''
}) {
  const variants = {
    gold: 'bg-[#a3b18a] text-[#344e41] border-[#344e41]',
    forest: 'bg-[#3a5a40] text-white border-[#344e41]',
    stone: 'bg-[#dad7cd] text-[#344e41] border-[#344e41]',
    white: 'bg-white text-[#344e41] border-[#344e41]',
    dark: 'bg-[#344e41] text-[#dad7cd] border-[#344e41]',
    fern: 'bg-[#588157] text-white border-[#344e41]',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-xs font-bold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono uppercase font-bold rounded-none border-2 shadow-[1px_1px_0px_0px_#344e41] select-none ${variants[variant] || variants.gold} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
}
