import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Mountain } from 'lucide-react';

export default function DestinationCard({ destination }) {
  const { slug, name, tagline, description, coverImage, idealDuration, altitude } = destination;

  return (
    <div className="group bg-white rounded-none border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#344e41] transition-none flex flex-col h-full">
      {/* Destination Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#dad7cd] border-b-2 border-[#344e41]">
        <img
          src={coverImage}
          alt={`Scenic view of ${name}`}
          className="w-full h-full object-cover transition-none"
          loading="lazy"
        />
        
        {/* State/Region Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-white text-[#344e41] border-2 border-[#344e41] shadow-[1px_1px_0px_#344e41]">
            Himalayan State
          </span>
        </div>

        {/* Quick Facts Overlay */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[11px] text-white font-bold">
          <span className="flex items-center gap-1 bg-[#344e41] border border-white px-2 py-0.5">
            <Clock className="w-3 h-3 text-[#a3b18a]" />
            {idealDuration}
          </span>
          <span className="flex items-center gap-1 bg-[#344e41] border border-white px-2 py-0.5">
            <Mountain className="w-3 h-3 text-[#a3b18a]" />
            {altitude}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-serif text-2xl font-black uppercase text-[#344e41] group-hover:text-[#3a5a40]">
            {name}
          </h3>
          <p className="font-mono text-xs font-bold text-[#588157] uppercase tracking-wide mt-1 mb-2.5">
            // {tagline}
          </p>
          <p className="text-xs sm:text-sm text-[#344e41]/80 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action Links */}
        <div className="pt-4 mt-4 border-t-2 border-[#344e41] flex items-center justify-between">
          <Link
            to={`/destinations/${slug}`}
            className="font-mono text-xs font-bold text-[#344e41] hover:text-[#588157] flex items-center gap-1 underline underline-offset-2"
          >
            <span>Region Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to={`/packages?destination=${slug}`}
            className="font-mono text-xs font-bold uppercase text-white bg-[#3a5a40] hover:bg-[#344e41] px-3 py-1.5 border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-none"
          >
            View Trips
          </Link>
        </div>
      </div>
    </div>
  );
}
