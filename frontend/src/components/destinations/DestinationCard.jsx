import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Mountain } from 'lucide-react';

export default function DestinationCard({ destination }) {
  const { slug, name, tagline, description, coverImage, idealDuration, altitude } = destination;

  return (
    <div className="card-organic group bg-cream rounded-2xl overflow-hidden border border-bark/20 shadow-nature flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={coverImage}
          alt={`Scenic view of ${name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-soil/60 via-transparent to-transparent" />

        {/* Top label */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-medium px-2 py-0.5 bg-cream/90 text-pine rounded-full uppercase tracking-wide border border-sage/30">
            Himalayan Region
          </span>
        </div>

        {/* Bottom fact pills */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-cream font-medium">
          <span className="flex items-center gap-1 bg-soil/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-sage" />{idealDuration}
          </span>
          <span className="flex items-center gap-1 bg-soil/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Mountain className="w-3 h-3 text-sage" />{altitude}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-2xl font-bold text-soil group-hover:text-pine transition-colors">{name}</h3>
          {tagline && (
            <p className="text-xs text-fern font-medium mt-1 mb-2 italic">{tagline}</p>
          )}
          <p className="text-sm text-soil/70 leading-relaxed line-clamp-3">{description}</p>
        </div>

        {/* Actions */}
        <div className="pt-4 mt-4 border-t border-bark/15 flex items-center justify-between">
          <Link
            to={`/destinations/${slug}`}
            className="text-sm font-medium text-pine hover:text-fern flex items-center gap-1 transition-colors"
          >
            Region Guide <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/packages?destination=${slug}`}
            className="text-xs font-semibold text-cream bg-pine px-3 py-1.5 rounded-organic hover:bg-fern transition-colors shadow-nature-sm"
          >
            View Trips
          </Link>
        </div>
      </div>
    </div>
  );
}
