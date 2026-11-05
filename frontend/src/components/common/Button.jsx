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
  // Organic button base: softly rounded, natural colours, gentle hover lift
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 ease-out rounded-organic focus:outline-none focus:ring-2 focus:ring-fern/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center select-none hover:-translate-y-0.5 active:translate-y-0.5';

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variantStyles = {
    primary:      'bg-pine text-cream shadow-nature-sm hover:bg-fern hover:shadow-nature',
    secondary:    'bg-beige text-soil border border-bark/30 shadow-nature-sm hover:bg-sage/30 hover:shadow-nature',
    gold:         'bg-fern text-cream shadow-nature-sm hover:bg-pine hover:shadow-nature',
    sage:         'bg-sage text-soil shadow-nature-sm hover:bg-sage/70 hover:shadow-nature',
    dark:         'bg-soil text-cream shadow-nature-sm hover:bg-bark hover:shadow-nature',
    white:        'bg-cream text-soil border border-bark/20 shadow-nature-sm hover:bg-beige hover:shadow-nature',
    outlineWhite: 'bg-transparent text-cream border-2 border-cream/70 hover:bg-cream hover:text-soil',
    ghost:        'bg-transparent border border-transparent hover:bg-sage/20 text-soil',
    ivory:        'bg-cream text-soil border border-bark/20 shadow-nature-sm hover:bg-beige',
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
