import React from 'react';
import SectionHeading from '../components/common/SectionHeading';
import BlogCard from '../components/blog/BlogCard';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  return (
    <div className="bg-[#dad7cd] pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <span>// HIMALAYAN JOURNAL &amp; GUIDES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            STORIES, ADVICE &amp; DISPATCHES
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#dad7cd] max-w-2xl mx-auto font-medium leading-relaxed">
            In-depth guides on high-altitude acclimatization, seasonal transitions in the valleys, and traveling gently through fragile mountain habitats.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>

    </div>
  );
}
