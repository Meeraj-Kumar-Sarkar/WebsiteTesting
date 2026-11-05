import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Compass, ArrowRight, MapPin } from 'lucide-react';
import { destinations } from '../../data/destinations';

export default function Header() {
  const [isDestOpen, setIsDestOpen]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const dropdownRef = useRef(null);
  const location    = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDestOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    setIsDestOpen(false);
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isActive = (p) => (p === '/' ? location.pathname === '/' : location.pathname.startsWith(p));

  const navLinks = [
    { name: 'Destinations', path: '/destinations', dropdown: true },
    { name: 'Packages',     path: '/packages'      },
    { name: 'Stays',        path: '/stays', badge: '48' },
    { name: 'Gallery',      path: '/gallery'       },
    { name: 'Blog',         path: '/blog'          },
    { name: 'About',        path: '/about'         },
    { name: 'Contact',      path: '/contact'       },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-nature border-b border-bark/10'
          : 'bg-cream/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 select-none shrink-0">
            <div className="w-8 h-8 bg-pine rounded-xl flex items-center justify-center shadow-nature-sm">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-cream w-5 h-5" aria-hidden="true">
                <path d="M3 19L9.5 8L13.5 14L16 10L21 19H3Z" fill="#f5f0e8"/>
              </svg>
            </div>
            <div>
              <span className="font-serif font-bold text-base text-soil leading-none block">Mountain &amp; Memories</span>
              <span className="text-[9px] text-sage font-medium tracking-widest uppercase">Thoughtful Journeys</span>
            </div>
          </Link>

          {/* Desktop nav — pill group like template */}
          <nav className="hidden lg:flex items-center gap-1 bg-beige/60 rounded-full px-2 py-1.5 border border-bark/15">
            {navLinks.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDestOpen(!isDestOpen)}
                      className={`nav-pill ${isActive(item.path) || isDestOpen ? 'active' : ''}`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDestOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {isDestOpen && (
                      <div className="absolute top-full left-0 mt-3 w-72 bg-cream/95 backdrop-blur-xl rounded-2xl border border-bark/15 shadow-nature-lg p-3 z-50 animate-scale-in">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-bark/10">
                          <span className="text-xs font-semibold text-soil/50 uppercase tracking-wider">Regions</span>
                          <Link to="/destinations" onClick={() => setIsDestOpen(false)} className="text-xs font-medium text-pine hover:text-fern transition-colors">
                            All Guides →
                          </Link>
                        </div>
                        <div className="space-y-1">
                          {destinations.map((dest) => (
                            <Link
                              key={dest.id}
                              to={`/destinations/${dest.slug}`}
                              onClick={() => setIsDestOpen(false)}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-beige transition-colors group"
                            >
                              <div>
                                <p className="text-sm font-medium text-soil">{dest.name}</p>
                                <p className="text-xs text-soil/50">{dest.idealDuration}</p>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-sage group-hover:text-fern transition-colors" />
                            </Link>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-bark/10 flex items-center justify-between text-xs">
                          <span className="text-soil/50">Multi-State Tour?</span>
                          <Link to="/customize-trip" onClick={() => setIsDestOpen(false)} className="font-semibold text-pine hover:text-fern transition-colors">Plan Here →</Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-pill ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-fern text-cream font-semibold">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile trigger */}
          <div className="flex items-center gap-3">
            <Link
              to="/customize-trip"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-soil text-cream text-sm font-semibold rounded-full hover:bg-pine transition-colors shadow-nature-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              Plan Trip
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-beige border border-bark/15 text-soil"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="lg:hidden bg-cream/95 backdrop-blur-xl border-t border-bark/10 px-4 py-5 shadow-nature-md animate-fade-up">
          <nav className="space-y-1">
            {[{ name: 'Home', path: '/' }, ...navLinks].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-pine text-cream'
                    : 'text-soil hover:bg-beige'
                }`}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-fern text-cream font-semibold">{item.badge} Stays</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-bark/10 grid grid-cols-2 gap-2">
            <Link to="/customize-trip" className="flex items-center justify-center gap-2 py-2.5 bg-soil text-cream text-sm font-semibold rounded-xl hover:bg-pine transition-colors">
              <Compass className="w-4 h-4" /> Plan Trip
            </Link>
            <Link to="/contact" className="flex items-center justify-center py-2.5 bg-beige text-soil text-sm font-semibold rounded-xl border border-bark/20 hover:bg-cream transition-colors">
              Enquire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
