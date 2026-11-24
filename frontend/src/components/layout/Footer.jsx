import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { frontendApi } from '../../api/client';

export default function Footer() {
  const [destinations, setDestinations] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    frontendApi.getDestinations().then(setDestinations).catch(() => {});
    frontendApi.getSettings().then(setSettings).catch(() => {});
  }, []);

  const phone = settings?.supportPhone || '+91 98765 43210';
  const cleanWaPhone = phone.replace(/\D/g, '');
  const email = settings?.supportEmail || 'contact@mountainandmemories.com';
  const address = settings?.registeredAddress || 'Manali, Himachal Pradesh, India';
  const companyName = settings?.companyName || 'Mountain & Memories';

  return (
    <footer className="bg-[#040f08]/78 backdrop-blur-2xl text-cream pt-14 pb-8 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-bark/30">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}favicon.png`}
                alt={`${companyName} logo`}
                className="w-10 h-10 rounded-lg shadow-nature-sm object-contain bg-white"
              />
              <div>
                <span className="font-sans text-xl font-bold tracking-tight text-cream block">{companyName}</span>
                <span className="text-[11px] text-sage font-semibold uppercase tracking-[0.18em]">Himalayan Expeditions</span>
              </div>
            </div>

            <p className="text-cream/70 text-sm leading-relaxed max-w-sm">
              Curated road journeys, nature walks, and peaceful retreats across the Himalayas — keeping groups private and partnering directly with regional hosts.
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
                { to: '/packages',       label: 'Stays & Packages' },
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
              {destinations.length === 0 ? (
                <li><Link to="/destinations" className="hover:text-cream transition-colors">Regional Guides →</Link></li>
              ) : (
                destinations.map(d => (
                  <li key={d.id}>
                    <Link to={`/destinations/${d.slug}`} className="hover:text-cream transition-colors duration-150 flex items-center justify-between">
                      <span>{d.name}</span>
                      <span className="text-xs text-sage">→</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Enquiries */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage border-b border-bark/30 pb-2">Enquiries</h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">Phone</span>
                <a href={`tel:${phone}`} className="hover:text-cream font-medium transition-colors">{phone}</a>
              </li>
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">WhatsApp</span>
                <a href={`https://wa.me/${cleanWaPhone}?text=Hi%20Mountain%20and%20Memories`} target="_blank" rel="noopener noreferrer" className="hover:text-cream font-medium underline underline-offset-2 transition-colors">Chat with us →</a>
              </li>
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">Email</span>
                <a href={`mailto:${email}`} className="hover:text-cream font-medium truncate block transition-colors">{email}</a>
              </li>
              <li>
                <span className="block text-[10px] text-sage uppercase font-semibold tracking-wide mb-0.5">Basecamp</span>
                <span className="text-cream/60 text-xs">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
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
