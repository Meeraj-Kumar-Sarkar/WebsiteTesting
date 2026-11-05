import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogCard({ post }) {
  const { slug, title, category, readTime, date, author, coverImage, excerpt } = post;

  return (
    <article className="card-organic group bg-cream rounded-2xl overflow-hidden border border-bark/20 shadow-nature flex flex-col h-full">
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-soil/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-medium px-2 py-0.5 bg-cream/90 text-pine rounded-full border border-sage/30 uppercase tracking-wide">
            {category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-soil/50 mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-sage" />{date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sage" />{readTime}</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-soil group-hover:text-pine transition-colors line-clamp-2 leading-snug">
            <Link to={`/blog/${slug}`}>{title}</Link>
          </h3>
          <p className="mt-2 text-sm text-soil/70 line-clamp-3 leading-relaxed">{excerpt}</p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-bark/15 flex items-center justify-between">
          {author && (
            <div className="flex items-center gap-2">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-7 h-7 rounded-full border border-sage/30 object-cover"
              />
              <span className="text-xs font-medium text-soil/70">{author.name}</span>
            </div>
          )}
          <Link
            to={`/blog/${slug}`}
            className="text-xs font-semibold text-pine hover:text-fern flex items-center gap-1 transition-colors"
          >
            Read Story <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
