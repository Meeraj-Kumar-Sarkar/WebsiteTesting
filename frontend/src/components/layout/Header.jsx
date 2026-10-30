import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Phone, Compass, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { destinations } from '../../data/destinations';
import Button from '../common/Button';

export default function Header() {
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDestinationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsDestinationsOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Destinations', path: '/destinations', hasDropdown: true },
    { name: 'Packages', path: '/packages' },
    { name: 'Curated Stays', path: '/stays', badge: '48' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#dad7cd] text-[#344e41] border-b-2 border-[#344e41] shadow-[0_2px_0px_0px_#344e41]">
      
      {/* Top Utility Bar for instant navigation access */}
      <div className="hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1 bg-[#344e41] text-[#dad7cd] font-mono text-[11px] border-b border-[#3a5a40]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#a3b18a] tracking-wider uppercase">// HIMALAYAN EXPEDITIONS</span>
          <span className="text-[#dad7cd]/60">|</span>
          <span className="hidden lg:inline text-white">100% Verified Lodges &amp; Private Transport</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/packages" className="hover:text-white underline decoration-[#a3b18a] underline-offset-2">
            Browse Packages &rarr;
          </Link>
          <Link to="/stays" className="hover:text-white underline decoration-[#a3b18a] underline-offset-2">
            Scouted Stays &rarr;
          </Link>
          <Link to="/customize-trip" className="bg-[#588157] text-white px-2 py-0.5 font-bold hover:bg-[#a3b18a] hover:text-[#344e41]">
            Custom Planner &rarr;
          </Link>
        </div>
      </div>

      {/* Main Brutalist Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Box */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 bg-[#344e41] text-[#dad7cd] border-2 border-[#344e41] flex items-center justify-center shadow-[2px_2px_0px_#344e41] group-hover:bg-[#3a5a40]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M3 19L9.5 8L13.5 14L16 10L21 19H3Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-black uppercase tracking-tight leading-none text-[#344e41]">
                Mountain &amp; Memories
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-[#3a5a40] mt-0.5">
                Thoughtful Journeys
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
                      className={`flex items-center gap-1 px-3 py-1.5 uppercase font-bold border-2 transition-none cursor-pointer ${
                        isActive(item.path) || isDestinationsOpen
                          ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41] shadow-[2px_2px_0px_#344e41]'
                          : 'bg-transparent text-[#344e41] border-transparent hover:border-[#344e41] hover:bg-[#a3b18a]/40'
                      }`}
                      aria-expanded={isDestinationsOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 ${isDestinationsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Brutalist Destinations Dropdown Menu */}
                    {isDestinationsOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41] p-3 z-50">
                        <div className="pb-2 mb-2 border-b-2 border-[#344e41] flex items-center justify-between">
                          <span className="font-mono text-xs font-bold uppercase text-[#344e41]">
                            // Regions
                          </span>
                          <Link
                            to="/destinations"
                            onClick={() => setIsDestinationsOpen(false)}
                            className="font-mono text-[11px] font-bold text-[#3a5a40] underline hover:text-[#344e41]"
                          >
                            All Guides &rarr;
                          </Link>
                        </div>

                        <div className="space-y-1.5">
                          {destinations.map((dest) => (
                            <Link
                              key={dest.id}
                              to={`/destinations/${dest.slug}`}
                              onClick={() => setIsDestinationsOpen(false)}
                              className="flex items-center justify-between p-2 border border-[#344e41] bg-[#dad7cd]/40 hover:bg-[#a3b18a] hover:text-[#344e41] transition-none group"
                            >
                              <div>
                                <p className="font-mono font-bold text-xs text-[#344e41]">
                                  {dest.name}
                                </p>
                                <p className="text-[10px] text-[#344e41]/70">
                                  {dest.idealDuration}
                                </p>
                              </div>
                              <span className="font-mono text-xs font-bold text-[#344e41]">&rarr;</span>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-2.5 pt-2 border-t-2 border-[#344e41] bg-[#dad7cd] p-2 text-[11px] font-mono flex items-center justify-between">
                          <span>Multi-State Tour?</span>
                          <Link
                            to="/customize-trip"
                            onClick={() => setIsDestinationsOpen(false)}
                            className="font-bold underline text-[#3a5a40]"
                          >
                            Plan Here
                          </Link>
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
                  className={`px-3 py-1.5 uppercase font-bold border-2 transition-none flex items-center gap-1.5 ${
                    isActive(item.path)
                      ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41] shadow-[2px_2px_0px_#344e41]'
                      : 'bg-transparent text-[#344e41] border-transparent hover:border-[#344e41] hover:bg-[#a3b18a]/40'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1 font-bold ${
                      isActive(item.path) ? 'bg-[#588157] text-white' : 'bg-[#588157] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Button
              to="/contact"
              variant="secondary"
              size="sm"
              className="text-xs"
            >
              Enquire
            </Button>

            <Button
              to="/customize-trip"
              variant="primary"
              size="sm"
              className="text-xs"
              icon={Compass}
              iconPosition="left"
            >
              Plan Trip
            </Button>
          </div>

          {/* Mobile Menu Trigger & Quick CTA */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              to="/customize-trip"
              variant="primary"
              size="sm"
              className="text-[11px] py-1 px-2.5"
            >
              Plan
            </Button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 bg-white border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] text-[#344e41] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Instant, high-contrast, brutalist list) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#dad7cd] border-t-2 border-[#344e41] px-4 py-4 shadow-[0_4px_0px_0px_#344e41]">
          <div className="space-y-2 font-mono text-xs font-bold uppercase">
            
            <Link
              to="/"
              className={`block p-2 border-2 ${
                location.pathname === '/' ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41]' : 'bg-white text-[#344e41] border-[#344e41]'
              }`}
            >
              [01] Home
            </Link>

            <div className="border-2 border-[#344e41] bg-white p-2">
              <div
                onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>[02] Destinations</span>
                <ChevronDown className={`w-4 h-4 ${isDestinationsOpen ? 'rotate-180' : ''}`} />
              </div>

              {isDestinationsOpen && (
                <div className="mt-2 pt-2 border-t border-[#344e41] space-y-1.5 pl-2">
                  {destinations.map((d) => (
                    <Link
                      key={d.id}
                      to={`/destinations/${d.slug}`}
                      className="block py-1 text-[#3a5a40] hover:underline"
                    >
                      &bull; {d.name}
                    </Link>
                  ))}
                  <Link
                    to="/destinations"
                    className="block pt-1 font-bold underline text-[#344e41]"
                  >
                    View All Guides &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/packages"
              className={`block p-2 border-2 ${
                location.pathname.startsWith('/packages') ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41]' : 'bg-white text-[#344e41] border-[#344e41]'
              }`}
            >
              [03] Packages &amp; Itineraries
            </Link>

            <Link
              to="/stays"
              className={`flex items-center justify-between p-2 border-2 ${
                location.pathname === '/stays' ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41]' : 'bg-white text-[#344e41] border-[#344e41]'
              }`}
            >
              <span>[04] Scouted Stays &amp; Chalets</span>
              <span className="bg-[#588157] text-white px-1 text-[10px]">48 STAYS</span>
            </Link>

            <Link
              to="/gallery"
              className={`block p-2 border-2 ${
                location.pathname === '/gallery' ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41]' : 'bg-white text-[#344e41] border-[#344e41]'
              }`}
            >
              [05] Travel Gallery
            </Link>

            <Link
              to="/blog"
              className={`block p-2 border-2 ${
                location.pathname.startsWith('/blog') ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41]' : 'bg-white text-[#344e41] border-[#344e41]'
              }`}
            >
              [06] Mountain Blog
            </Link>

            <Link
              to="/about"
              className={`block p-2 border-2 ${
                location.pathname === '/about' ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41]' : 'bg-white text-[#344e41] border-[#344e41]'
              }`}
            >
              [07] About Us
            </Link>

            <Link
              to="/contact"
              className={`block p-2 border-2 ${
                location.pathname === '/contact' ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41]' : 'bg-white text-[#344e41] border-[#344e41]'
              }`}
            >
              [08] Contact &amp; Enquiries
            </Link>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <Button
                to="/customize-trip"
                variant="primary"
                size="md"
                className="w-full text-center"
              >
                Plan Trip
              </Button>
              <Button
                to="/contact"
                variant="secondary"
                size="md"
                className="w-full text-center"
              >
                Enquire
              </Button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
