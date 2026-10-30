import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogCard({ post }) {
  const { slug, title, category, readTime, date, author, coverImage, excerpt } = post;

  return (
    <article className="group bg-white rounded-none border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#344e41] transition-none flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#dad7cd] border-b-2 border-[#344e41]">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover transition-none"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="font-mono px-2 py-0.5 text-[10px] font-bold uppercase bg-white text-[#344e41] border-2 border-[#344e41] shadow-[1px_1px_0px_#344e41]">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#344e41]/70 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#588157]" />
              {date}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#588157]" />
              {readTime}
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-black text-[#344e41] group-hover:text-[#3a5a40] line-clamp-2 leading-snug">
            <Link to={`/blog/${slug}`}>
              {title}
            </Link>
          </h3>

          <p className="mt-2 text-xs text-[#344e41]/80 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* Footer / Author & CTA */}
        <div className="mt-4 pt-3 border-t-2 border-[#344e41] flex items-center justify-between">
          {author && (
            <div className="flex items-center gap-2">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-6 h-6 rounded-none border border-[#344e41] object-cover"
              />
              <span className="font-mono text-xs font-bold text-[#344e41]">
                {author.name}
              </span>
            </div>
          )}

          <Link
            to={`/blog/${slug}`}
            className="font-mono text-xs font-bold text-[#3a5a40] hover:text-[#344e41] flex items-center gap-1 underline underline-offset-2"
          >
            <span>Read Story</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
