import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { destinations } from '../../data/destinations';

export default function Footer() {
  return (
    <footer className="bg-soil text-cream pt-14 pb-8 border-t border-bark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-bark/30">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream text-soil flex items-center justify-center rounded-organic shadow-nature-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M3 19L9.5 8L13.5 14L16 10L21 19H3Z" /></svg>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-cream block">Mountain &amp; Memories</span>
                <span className="text-xs text-sage uppercase tracking-widest">Thoughtful Himalayan Journeys</span>
              </div>
            </div>

            <p className="text-cream/70 text-sm leading-relaxed max-w-sm">
              Curated road journeys, nature walks, and peaceful retreats across Himachal Pradesh, Uttarakhand, Ladakh, and Kashmir — keeping groups private and partnering directly with regional hosts.
            </p>

            <div className="flex items-center gap-3">
              {[
                { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                { href: 'https://facebook.com',  icon: Facebook,  label: 'Facebook'  },
                { href: 'https://youtube.com',   icon: Youtube,   label: 'YouTube'   },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-pine rounded-organic flex items-center justify-center text-cream hover:bg-fern transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage border-b border-bark/30 pb-2">Explore</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              {[
                { to: '/about',          label: 'Philosophy & Story' },
                { to: '/destinations',   label: 'All Himalayan Regions' },
                { to: '/packages',       label: 'Curated Tour Packages' },
                { to: '/stays',          label: 'Scouted Stays' },
                { to: '/gallery',        label: 'Travel Gallery' },
                { to: '/blog',           label: 'Stories & Guides' },
                { to: '/customize-trip', label: 'Customize Your Trip →', highlight: true },
              ].map(({ to, label, highlight }) => (
                <li key={to}>
                  <Link to={to} className={`hover:text-cream transition-colors duration-150 ${highlight ? 'text-sage font-semibold' : ''}`}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage border-b border-bark/30 pb-2">Regions</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              {destinations.map(d => (
                <li key={d.id}>
                  <Link to={`/destinations/${d.slug}`} className="hover:text-cream transition-colors duration-150 flex items-center justify-between">
                    <span>{d.name}</span>
                    <span className="text-xs text-sage">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enquiries */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage border-b border-bark/30 pb-2">Enquiries</h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">Phone</span>
                <a href="tel:+919876543210" className="hover:text-cream font-medium transition-colors">+91 98765 43210</a>
              </li>
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">WhatsApp</span>
                <a href="https://wa.me/919876543210?text=Hi%20Mountain%20and%20Memories" target="_blank" rel="noopener noreferrer" className="hover:text-cream font-medium underline underline-offset-2 transition-colors">Chat with us →</a>
              </li>
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">Email</span>
                <a href="mailto:concierge@mountainandmemories.demo" className="hover:text-cream font-medium truncate block transition-colors">concierge@mountainandmemories.demo</a>
              </li>
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">Basecamp</span>
                <span className="text-cream/60 text-xs">Manali / Dehradun, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Banner */}
        <div className="py-3 my-6 px-5 bg-pine/60 rounded-organic flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-cream/80 border border-bark/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sage inline-block" />
            <span><strong>Prototype Demo:</strong> Fixed packages, INR estimates &amp; accommodations are curated demonstration data.</span>
          </div>
          <Link to="/customize-trip" className="font-semibold underline underline-offset-2 text-cream hover:text-sage whitespace-nowrap transition-colors">Try Custom Planner →</Link>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50 border-t border-bark/20">
          <p>&copy; {new Date().getFullYear()} Mountain &amp; Memories. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-cream transition-colors">Ethical Pledge</Link>
            <Link to="/contact" className="hover:text-cream transition-colors">Contact</Link>
            <Link to="/packages" className="hover:text-cream transition-colors">All Packages</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
