import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function PackageCard({ pkg }) {
  const {
    slug,
    name,
    destinationName,
    duration,
    startingPrice,
    tripType,
    label,
    coverImage,
    shortOverview,
    highlights
  } = pkg;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(startingPrice);

  return (
    <div className="group bg-white rounded-none border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#344e41] transition-none flex flex-col h-full">
      
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#dad7cd] border-b-2 border-[#344e41]">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover transition-none"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <Badge variant="white" size="sm">
            {tripType}
          </Badge>

          {label && (
            <span className="font-mono px-2 py-0.5 text-[10px] font-bold uppercase bg-[#588157] text-white border-2 border-[#344e41] shadow-[1px_1px_0px_#344e41]">
              {label}
            </span>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[11px] text-white font-bold">
          <span className="flex items-center gap-1 bg-[#344e41] border border-white px-1.5 py-0.5 shadow-sm">
            <Clock className="w-3 h-3 text-[#a3b18a]" />
            {duration}
          </span>
          <span className="flex items-center gap-1 bg-[#344e41] border border-white px-1.5 py-0.5 shadow-sm">
            <MapPin className="w-3 h-3 text-[#a3b18a]" />
            {destinationName}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-black text-[#344e41] group-hover:text-[#3a5a40] line-clamp-1">
            <Link to={`/packages/${slug}`}>
              {name}
            </Link>
          </h3>

          <p className="mt-2 text-xs text-[#344e41]/80 line-clamp-2 leading-relaxed">
            {shortOverview}
          </p>

          {/* Highlights Bullets */}
          {highlights && highlights.length > 0 && (
            <div className="mt-3 pt-3 border-t-2 border-[#dad7cd] space-y-1 font-mono text-[11px]">
              {highlights.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[#344e41]/90">
                  <span className="text-[#588157] font-bold">&bull;</span>
                  <span className="line-clamp-1">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing and Action */}
        <div className="mt-4 pt-3 border-t-2 border-[#344e41] flex items-end justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase font-bold text-[#344e41]/60">
              Demo Price From
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold font-mono text-[#3a5a40]">
                {formattedPrice}
              </span>
              <span className="text-[10px] font-mono text-[#344e41]/60">/ person</span>
            </div>
          </div>

          <Link
            to={`/packages/${slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold uppercase bg-[#3a5a40] hover:bg-[#344e41] text-white border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-none"
          >
            <span>View Trip</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

    </div>
  );
}
