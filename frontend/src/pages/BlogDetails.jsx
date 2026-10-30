import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Compass } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import { packages } from '../data/packages';
import Button from '../components/common/Button';

export default function BlogDetails() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center font-mono">
        <h2 className="font-serif text-3xl font-black uppercase text-[#344e41]">Article Not Found</h2>
        <p className="text-xs text-[#344e41]/80 mt-2 mb-5">The story you are looking for does not exist or has been moved.</p>
        <Button to="/blog" variant="primary">
          Return to Blog
        </Button>
      </div>
    );
  }

  const relatedPackage = post.relatedPackageSlug
    ? packages.find((p) => p.slug === post.relatedPackageSlug)
    : null;

  return (
    <div className="bg-[#dad7cd] pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-[#a3b18a] hover:text-white mb-3 underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Stories &amp; Guides
          </Link>

          <div className="inline-block px-2.5 py-0.5 font-mono text-xs font-bold uppercase bg-[#3a5a40] text-white border border-white mb-3 block w-fit mx-auto">
            {post.category}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-[#dad7cd]">
            {post.author && (
              <span className="font-bold text-white uppercase">{post.author.name}</span>
            )}
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#a3b18a]" />
              {post.date}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#a3b18a]" />
              {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-none overflow-hidden border-2 border-[#344e41] shadow-[5px_5px_0px_0px_#344e41] bg-white p-2">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover border border-[#344e41]"
          />
        </div>
      </div>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-white p-6 sm:p-10 border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41] text-[#344e41] leading-relaxed space-y-4 text-sm sm:text-base font-medium
            [&_.lead]:text-base [&_.lead]:sm:text-lg [&_.lead]:font-bold [&_.lead]:text-[#344e41] [&_.lead]:border-b-2 [&_.lead]:border-[#dad7cd] [&_.lead]:pb-3
            [&_h3]:font-serif [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-black [&_h3]:uppercase [&_h3]:text-[#344e41] [&_h3]:mt-6 [&_h3]:mb-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#588157] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#344e41] [&_blockquote]:my-4 [&_blockquote]:bg-[#dad7cd]/40 [&_blockquote]:py-2
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:font-mono [&_ul]:text-xs [&_ul]:sm:text-sm
            [&_strong]:text-[#344e41] [&_strong]:font-bold
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Itinerary Callout */}
        {relatedPackage && (
          <div className="mt-8 p-5 bg-white rounded-none border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3">
              <img
                src={relatedPackage.coverImage}
                alt={relatedPackage.name}
                className="w-16 h-16 border-2 border-[#344e41] object-cover flex-shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#588157] block">
                  // EXPERIENCE THIS ROUTE
                </span>
                <h4 className="font-serif font-black text-base uppercase text-[#344e41]">
                  {relatedPackage.name}
                </h4>
                <p className="text-[11px] text-[#344e41]/70">
                  {relatedPackage.duration} &bull; {relatedPackage.destinationName}
                </p>
              </div>
            </div>

            <Button
              to={`/packages/${relatedPackage.slug}`}
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="whitespace-nowrap"
            >
              View Route
            </Button>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 border-t-2 border-[#344e41] flex items-center justify-between font-mono">
          <Link
            to="/blog"
            className="text-xs font-bold text-[#344e41] hover:text-[#588157] flex items-center gap-1.5 underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </Link>
          <Button to="/customize-trip" variant="secondary" size="sm" icon={Compass}>
            Plan Similar Journey
          </Button>
        </div>
      </article>

    </div>
  );
}
