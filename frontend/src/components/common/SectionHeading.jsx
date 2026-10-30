import React from 'react';

export default function SectionHeading({
  tag,
  title,
  subtitle,
  align = 'center',
  className = '',
  light = false
}) {
  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-8 md:mb-12 ${alignments[align]} ${className}`}>
      {tag && (
        <div className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold mb-2.5 px-2 py-0.5 border-2 ${
          light
            ? 'bg-[#3a5a40] text-[#dad7cd] border-[#dad7cd]'
            : 'bg-[#a3b18a] text-[#344e41] border-[#344e41] shadow-[2px_2px_0px_#344e41]'
        }`}>
          <span>// {tag}</span>
        </div>
      )}
      {title && (
        <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase ${
          light ? 'text-[#dad7cd]' : 'text-[#344e41]'
        }`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`mt-3 text-sm md:text-base leading-relaxed font-medium ${
          light ? 'text-[#dad7cd]/90' : 'text-[#344e41]/85'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
