import React from 'react';

export default function SectionHeading({ tag, title, subtitle, align = 'center', className = '', light = false }) {
  const alignments = {
    left:   'text-left items-start',
    center: 'text-center items-center mx-auto',
    right:  'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-8 md:mb-12 ${alignments[align]} ${className}`}>
      {tag && (
        <span className={`inline-block text-xs font-medium tracking-widest uppercase mb-3 px-3 py-1 rounded-full border ${
          light
            ? 'bg-sage/20 text-cream border-sage/40'
            : 'bg-sage/20 text-pine border-sage/40'
        }`}>
          {tag}
        </span>
      )}
      {title && (
        <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-snug ${
          light ? 'text-cream' : 'text-soil'
        }`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`mt-3 text-base leading-relaxed ${
          light ? 'text-cream/80' : 'text-soil/70'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
