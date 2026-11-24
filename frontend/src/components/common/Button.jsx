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
  // Crisp executive business button base
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-200 ease-out rounded-md focus:outline-none focus:ring-2 focus:ring-sage/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center select-none hover:-translate-y-0.5 active:translate-y-0';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-7 py-3.5 text-sm',
  };

  const variantStyles = {
    primary:      'bg-pine text-cream border border-fern/50 shadow-nature-sm hover:bg-fern hover:border-sage/50 hover:shadow-nature',
    secondary:    'bg-cream/80 text-soil border border-bark/35 shadow-nature-sm hover:bg-pine/40 hover:border-sage/50 hover:shadow-nature',
    gold:         'bg-fern text-cream border border-sage/30 shadow-nature-sm hover:bg-pine hover:shadow-nature',
    sage:         'bg-sage text-[#06150a] border border-sage shadow-nature-sm hover:bg-[#a6e645] hover:shadow-nature',
    dark:         'bg-[#0a2312] text-cream border border-bark/40 shadow-nature-sm hover:bg-pine hover:border-sage/40 hover:shadow-nature',
    white:        'bg-cream/85 text-soil border border-bark/30 shadow-nature-sm hover:bg-pine/40 hover:border-sage/40 hover:shadow-nature',
    outlineWhite: 'bg-transparent text-cream border border-cream/60 hover:bg-cream hover:text-[#06150a]',
    ghost:        'bg-transparent border border-transparent hover:bg-pine/30 text-soil',
    ivory:        'bg-cream/85 text-soil border border-bark/30 shadow-nature-sm hover:bg-pine/40',
  };

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2 flex-shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2 flex-shrink-0" />}
    </>
  );

  const combinedClass = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  if (to) return <Link to={to} className={combinedClass} {...props}>{content}</Link>;
  if (href) return <a href={href} className={combinedClass} {...props}>{content}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClass} {...props}>
      {content}
    </button>
  );
}
