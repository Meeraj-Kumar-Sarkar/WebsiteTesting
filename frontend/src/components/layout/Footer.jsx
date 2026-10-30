import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Compass, ArrowUpRight } from 'lucide-react';
import { destinations } from '../../data/destinations';

export default function Footer() {
  return (
    <footer className="bg-[#344e41] text-[#dad7cd] pt-12 pb-10 border-t-2 border-[#344e41]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b-2 border-[#3a5a40]">
          
          {/* Brand Info & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#dad7cd] text-[#344e41] border-2 border-[#dad7cd] flex items-center justify-center font-bold">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M3 19L9.5 8L13.5 14L16 10L21 19H3Z" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-xl font-black uppercase tracking-tight text-white block">
                  Mountain &amp; Memories
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#a3b18a]">
                  Thoughtful Himalayan Journeys
                </span>
              </div>
            </div>

            <p className="text-[#dad7cd]/80 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Curated road journeys, nature walks, and peaceful retreats across Himachal Pradesh, Uttarakhand, Ladakh, and Kashmir. Keeping groups private and partnering directly with regional hosts.
            </p>

            <div className="pt-2 flex items-center gap-2 font-mono text-xs">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#3a5a40] border-2 border-[#dad7cd] flex items-center justify-center text-[#dad7cd] hover:bg-[#588157] hover:text-white transition-none"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#3a5a40] border-2 border-[#dad7cd] flex items-center justify-center text-[#dad7cd] hover:bg-[#588157] hover:text-white transition-none"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#3a5a40] border-2 border-[#dad7cd] flex items-center justify-center text-[#dad7cd] hover:bg-[#588157] hover:text-white transition-none"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#a3b18a] border-b-2 border-[#3a5a40] pb-1.5">
              // Explore
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#dad7cd]">
              <li>
                <Link to="/about" className="hover:text-white hover:underline">&bull; Philosophy &amp; Story</Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white hover:underline">&bull; All Himalayan Regions</Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-white hover:underline">&bull; Curated Tour Packages</Link>
              </li>
              <li>
                <Link to="/stays" className="hover:text-white hover:underline flex items-center justify-between">
                  <span>&bull; Scouted Stays</span>
                  <span className="bg-[#588157] text-white px-1 text-[10px] font-bold">48 STAYS</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white hover:underline">&bull; Travel Gallery</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white hover:underline">&bull; Stories &amp; Guides</Link>
              </li>
              <li>
                <Link to="/customize-trip" className="text-[#a3b18a] font-bold hover:text-white underline">
                  &bull; Customize Trip &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations We Cover */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#a3b18a] border-b-2 border-[#3a5a40] pb-1.5">
              // Regions
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#dad7cd]">
              {destinations.map(d => (
                <li key={d.id}>
                  <Link to={`/destinations/${d.slug}`} className="hover:text-white hover:underline flex items-center justify-between">
                    <span>&bull; {d.name}</span>
                    <span className="text-[10px] text-[#a3b18a]">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Enquiries */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#a3b18a] border-b-2 border-[#3a5a40] pb-1.5">
              // Enquiries
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-[#dad7cd]">
              <li>
                <span className="block text-[10px] text-[#a3b18a] uppercase font-bold">Phone Support</span>
                <a href="tel:+919876543210" className="hover:text-white font-bold">
                  +91 98765 43210
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-[#a3b18a] uppercase font-bold">WhatsApp Dispatch</span>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Mountain%20and%20Memories,%20I%20would%20like%20to%20plan%20a%20Himalayan%20journey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-bold flex items-center gap-1 underline"
                >
                  Chat on WhatsApp &rarr;
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-[#a3b18a] uppercase font-bold">Email</span>
                <a href="mailto:concierge@mountainandmemories.demo" className="hover:text-white font-bold truncate block">
                  concierge@mountainandmemories.demo
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-[#a3b18a] uppercase font-bold">Basecamp</span>
                <span className="text-[11px] text-[#dad7cd]/80 block">
                  Manali / Dehradun Base, India
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="py-3 my-6 px-4 bg-[#3a5a40] border-2 border-[#dad7cd] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-[#dad7cd]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#a3b18a]"></span>
            <span>
              <strong>PROTOTYPE DEMO:</strong> Fixed packages, INR estimates &amp; accommodations are curated demonstration data.
            </span>
          </div>
          <Link to="/customize-trip" className="font-bold underline text-white hover:text-[#a3b18a] whitespace-nowrap">
            Try Custom Planner &rarr;
          </Link>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[11px] text-[#dad7cd]/70 border-t border-[#3a5a40]">
          <p>
            &copy; {new Date().getFullYear()} Mountain &amp; Memories. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white">Ethical Pledge</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/packages" className="hover:text-white">All Packages</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
