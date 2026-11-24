import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, MapPin, ArrowUpRight, Send, Check, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';
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

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [enquiryId, setEnquiryId] = useState('');
  const [settings, setSettings] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Journey Enquiry',
    message: ''
  });

  useEffect(() => {
    frontendApi.getSettings().then(setSettings).catch(() => {});
  }, []);

  const [heroRef, heroInView] = useInView(0.08);
  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await frontendApi.submitEnquiry({
        source: 'WEBSITE',
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsappNumber: formData.phone,
        selectedPackage: formData.subject,
        message: formData.message,
      });
      setEnquiryId(res.enquiry?.enquiryId || '');
      setFormSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Unable to submit your enquiry right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const phone = settings?.supportPhone || '+91 98765 43210';
  const cleanWaPhone = phone.replace(/\D/g, '');
  const email = settings?.supportEmail || 'contact@mountainandmemories.com';
  const address = settings?.registeredAddress || 'Old Manali Road, Manali, Himachal Pradesh';

  const contactItems = [
    {
      icon: Phone,
      iconBg: 'bg-sage/20',
      iconColor: 'text-pine',
      label: 'Phone inquiries',
      main: <a href={`tel:${phone}`} className="font-medium text-sm text-soil hover:text-pine transition-colors">{phone}</a>,
      sub: 'Mon to Sat, 9:00 AM – 7:30 PM IST',
    },
    {
      icon: MessageSquare,
      iconBg: 'bg-pine/10',
      iconColor: 'text-pine',
      label: 'WhatsApp travel desk',
      main: (
        <a
          href={`https://wa.me/${cleanWaPhone}?text=Hi%20Mountain%20and%20Memories,%20I%20have%20an%20enquiry`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sm text-soil hover:text-pine flex items-center gap-1 transition-colors"
        >
          <span>{phone}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-sage" />
        </a>
      ),
      sub: 'Instant messaging & consultations',
    },
    {
      icon: Mail,
      iconBg: 'bg-sage/20',
      iconColor: 'text-pine',
      label: 'Email correspondence',
      main: <a href={`mailto:${email}`} className="font-medium text-xs sm:text-sm text-soil hover:text-pine transition-colors block truncate">{email}</a>,
      sub: 'Response within 12 operational hours',
    },
    {
      icon: MapPin,
      iconBg: 'bg-beige',
      iconColor: 'text-pine',
      label: 'Base hubs',
      main: <p className="font-medium text-sm text-soil">{address}</p>,
      sub: 'Logistical basecamp center',
    },
  ];

  return (
    <div className="bg-cream pb-24">

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-beige to-cream py-14 px-4 sm:px-6 lg:px-8 mb-10 border-b border-bark/20">
        <div
          ref={heroRef}
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            Direct concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soil">
            Connect with our specialists
          </h1>
          <p className="mt-4 text-sm text-soil/70 max-w-2xl mx-auto leading-relaxed">
            Have a question regarding high passes, child-friendly mountain routes, or seasonal road openings? We are here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column */}
          <div
            ref={leftRef}
            className={`lg:col-span-5 space-y-6 transition-all duration-700 ease-out ${leftInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-3 py-0.5 mb-3">
                Dispatch desk
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soil mb-2">
                We are always a call or message away.
              </h2>
              <p className="text-sm text-soil/70 leading-relaxed">
                Our operations coordinators are based right in the hill states, tracking weather conditions, pass openings, and road permits in real time.
              </p>
            </div>

            <div className="space-y-3">
              {contactItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-cream rounded-2xl border border-bark/20 shadow-nature-sm flex items-start gap-3 transition-all duration-700 ease-out"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-soil/50 uppercase tracking-wide block mb-0.5">
                      {item.label}
                    </span>
                    {item.main}
                    <p className="text-xs text-soil/50 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div
            ref={rightRef}
            className={`lg:col-span-7 transition-all duration-700 ease-out ${rightInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="bg-cream rounded-2xl p-6 sm:p-8 border border-bark/20 shadow-nature">

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-fern flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-cream" />
                  </div>
                  {enquiryId && (
                    <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-mono font-bold px-3 py-0.5 mb-3">
                      Reference ID: {enquiryId}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl font-bold text-soil">
                    Message received!
                  </h3>
                  <p className="text-sm text-soil/70 max-w-md mx-auto mt-2 leading-relaxed">
                    Thank you for reaching out, <strong>{formData.name}</strong>. Your enquiry for <em>"{formData.subject}"</em> has been logged with our Sales &amp; Operations desk.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        setFormSubmitted(false);
                        setEnquiryId('');
                        setFormData({ name: '', email: '', phone: '', subject: 'General Journey Enquiry', message: '' });
                      }}
                      variant="secondary"
                      size="md"
                    >
                      Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-soil">
                      Send us a direct message
                    </h3>
                    <p className="text-sm text-soil/60 mt-1">
                      Fill out the form below and our itinerary specialist will respond promptly.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                        Your full name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Roy"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                        Phone / WhatsApp number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                      Subject / topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40 cursor-pointer"
                    >
                      <option value="General Journey Enquiry">General Journey Enquiry</option>
                      <option value="Spiti Valley High Passes">Spiti Valley High Passes</option>
                      <option value="Kashmir Houseboats & Gulmarg">Kashmir Houseboats &amp; Gulmarg</option>
                      <option value="Valley of Flowers & Trekking">Valley of Flowers &amp; Trekking</option>
                      <option value="Ladakh Road Circuit">Ladakh Road Circuit</option>
                      <option value="Custom Group or Family Voyage">Custom Group or Family Voyage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-soil/60 uppercase tracking-wider mb-1">
                      Your message or questions
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what you have in mind: preferred months, number of people, or specific requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-soil/50 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                      Direct to our travel specialists
                    </span>

                    <Button type="submit" disabled={submitting} variant="primary" size="md" icon={Send} iconPosition="right">
                      {submitting ? 'Sending...' : 'Send enquiry'}
                    </Button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
