import React, { useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import Button from '../components/common/Button';
import { frontendApi } from '../api/client';

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPackage, setRelatedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [heroRef, heroInView] = useInView(0.08);
  const [bodyRef, bodyInView] = useInView(0.08);

  useEffect(() => {
    setLoading(true);
    frontendApi.getBlog(slug)
      .then((res) => {
        setPost(res);
        if (res?.relatedPackageSlug) {
          frontendApi.getPackage(res.relatedPackageSlug).then(setRelatedPackage).catch(() => {});
        }
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-sm text-soil/60">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-soil">Article not found</h2>
        <p className="text-sm text-soil/70 mt-2 mb-5">The story you are looking for does not exist or has been moved.</p>
        <Button to="/blog" variant="primary">
          Return to blog
        </Button>
      </div>
    );
  }

  const authorName = post.author?.name || post.authorName || 'Editorial Team';

  return (
    <div className="bg-transparent pb-20">

      {/* Header Banner */}
      <div className="page-hero py-14 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-pine hover:text-fern mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All stories &amp; guides
          </Link>

          <div className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium px-3 py-1 mb-4">
            {post.category}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soil leading-tight">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-soil/60">
            <span className="font-medium text-soil">{authorName}</span>
            {post.date && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sage" />
                  {post.date}
                </span>
              </>
            )}
            {post.readTime && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sage" />
                  {post.readTime}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="rounded-2xl overflow-hidden border border-bark/20 shadow-nature">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
        <div
          className="glass-card p-6 sm:p-10 text-soil leading-relaxed space-y-4 text-sm sm:text-base
            [&_.lead]:text-base [&_.lead]:sm:text-lg [&_.lead]:font-medium [&_.lead]:text-soil [&_.lead]:border-b [&_.lead]:border-bark/15 [&_.lead]:pb-4
            [&_h3]:font-serif [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-soil [&_h3]:mt-6 [&_h3]:mb-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-sage [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-soil/70 [&_blockquote]:my-4 [&_blockquote]:bg-beige/50 [&_blockquote]:py-3 [&_blockquote]:rounded-r-xl
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-sm
            [&_strong]:text-soil [&_strong]:font-semibold
          "
          dangerouslySetInnerHTML={{ __html: post.content || post.body }}
        />

        {relatedPackage && (
          <div className="mt-8 p-5 bg-beige rounded-2xl border border-bark/20 shadow-nature flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {relatedPackage.coverImage && (
                <img
                  src={relatedPackage.coverImage}
                  alt={relatedPackage.name}
                  className="w-16 h-16 rounded-xl border border-bark/20 object-cover flex-shrink-0"
                />
              )}
              <div>
                <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium px-2 py-0.5 mb-1">
                  Experience this route
                </span>
                <h4 className="font-serif font-bold text-base text-soil">
                  {relatedPackage.name}
                </h4>
                <p className="text-xs text-soil/60">
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
              View route
            </Button>
          </div>
        )}

        <div className="mt-8 pt-5 border-t border-bark/15 flex items-center justify-between">
          <Link
            to="/blog"
            className="text-sm font-medium text-pine hover:text-fern flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to journal
          </Link>
          <Button to="/customize-trip" variant="secondary" size="sm" icon={Compass}>
            Plan similar journey
          </Button>
        </div>
      </article>

    </div>
  );
}
