import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogCard({ post }) {
  const { slug, id, title, category, readTime, date, author, authorName, coverImage, excerpt } = post;
  const linkSlug = slug || id;
  const resolvedAuthorName = author?.name || authorName || 'Editorial Team';

  return (
    <article className="card-organic group bg-cream rounded-2xl overflow-hidden border border-bark/20 shadow-nature flex flex-col h-full">
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-beige">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-soil/40 text-xs">
            Mountain &amp; Memories Journal
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-soil/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#05140b]/78 backdrop-blur-md text-sage rounded-full border border-white/20 uppercase tracking-wider">
            {category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-soil/50 mb-2">
            {date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-sage" />{date}</span>}
            {date && readTime && <span>•</span>}
            {readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sage" />{readTime}</span>}
          </div>
          <h3 className="font-serif text-lg font-bold text-soil group-hover:text-pine transition-colors line-clamp-2 leading-snug">
            <Link to={`/blog/${linkSlug}`}>{title}</Link>
          </h3>
          <p className="mt-2 text-sm text-soil/70 line-clamp-3 leading-relaxed">{excerpt}</p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-bark/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-pine text-cream text-[10px] font-bold flex items-center justify-center">
              {resolvedAuthorName.charAt(0)}
            </div>
            <span className="text-xs font-medium text-soil/70">{resolvedAuthorName}</span>
          </div>
          <Link
            to={`/blog/${linkSlug}`}
            className="text-xs font-semibold text-pine hover:text-fern flex items-center gap-1 transition-colors"
          >
            Read Story <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
