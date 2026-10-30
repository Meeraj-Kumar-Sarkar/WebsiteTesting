import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  // Brutalist button base: sharp edges, solid 2px border, hard drop shadow, snappy active press
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide uppercase transition-none rounded-none border-2 border-[#344e41] focus:outline-none focus:ring-2 focus:ring-[#3a5a40] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center select-none shadow-[2px_2px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#344e41] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-mono",
    md: "px-4 py-2 text-xs sm:text-sm font-mono",
    lg: "px-6 py-3 text-sm sm:text-base font-mono",
  };

  const variantStyles = {
    // Primary hunter green
    primary: "bg-[#3a5a40] hover:bg-[#344e41] text-white",
    // Light neutral button
    secondary: "bg-[#dad7cd] hover:bg-[#a3b18a] text-[#344e41]",
    // Fern green accent
    gold: "bg-[#588157] hover:bg-[#3a5a40] text-white",
    // Sage green button
    sage: "bg-[#a3b18a] hover:bg-[#dad7cd] text-[#344e41]",
    // Darkest forest button
    dark: "bg-[#344e41] hover:bg-[#3a5a40] text-[#dad7cd]",
    // White stark card button
    white: "bg-white hover:bg-[#dad7cd] text-[#344e41]",
    // Outline white for dark hero backgrounds
    outlineWhite: "bg-transparent text-white border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] hover:bg-white hover:text-[#344e41]",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-[#a3b18a]/30 text-[#344e41]",
    ivory: "bg-[#dad7cd] hover:bg-[#a3b18a] text-[#344e41]"
  };

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2 flex-shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2 flex-shrink-0" />}
    </>
  );

  const combinedClass = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClass} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClass} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClass} {...props}>
      {content}
    </button>
  );
}
