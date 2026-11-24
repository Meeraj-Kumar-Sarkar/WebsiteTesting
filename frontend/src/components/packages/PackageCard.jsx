import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function PackageCard({ pkg }) {
  const {
    slug,
    id,
    name,
    destinationName,
    states,
    duration,
    startingPrice,
    basePrice,
    tripType = 'Adventure',
    label,
    coverImage,
    shortOverview,
    shortDescription,
    highlights = []
  } = pkg;

  const price = Number(startingPrice ?? basePrice ?? 0);
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(price);

  const linkSlug = slug || id;

  return (
    <div className="card-organic group bg-cream rounded-2xl overflow-hidden border border-bark/20 shadow-nature flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-beige">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-soil/40 text-xs">
            Mountain &amp; Memories
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-soil/50 to-transparent" />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant="white" size="sm">{tripType}</Badge>
          {label && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-fern text-cream rounded-full uppercase tracking-wide">{label}</span>
          )}
        </div>

        {/* Bottom info pills */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-cream font-medium">
          <span className="flex items-center gap-1 bg-soil/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-sage" />{duration}
          </span>
          <span className="flex items-center gap-1 bg-soil/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <MapPin className="w-3 h-3 text-sage" />{destinationName || states}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-soil group-hover:text-pine transition-colors line-clamp-1">
            <Link to={`/packages/${linkSlug}`}>{name}</Link>
          </h3>
          <p className="mt-2 text-sm text-soil/70 line-clamp-2 leading-relaxed">{shortOverview || shortDescription}</p>

          {highlights && highlights.length > 0 && (
            <div className="mt-3 pt-3 border-t border-bark/15 space-y-1 text-xs">
              {highlights.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-soil/70">
                  <span className="text-fern mt-0.5">•</span>
                  <span className="line-clamp-1">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-bark/15 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-soil/50 font-medium">Starting From</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-pine">{formattedPrice}</span>
              <span className="text-xs text-soil/50">/ person</span>
            </div>
          </div>
          <Link
            to={`/packages/${linkSlug}`}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-pine text-cream rounded-organic hover:bg-fern transition-colors duration-200 shadow-nature-sm"
          >
            View Trip <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
