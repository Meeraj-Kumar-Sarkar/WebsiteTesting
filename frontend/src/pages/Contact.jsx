import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Send, Check, ShieldCheck, MessageSquare } from 'lucide-react';
import Button from '../components/common/Button';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Journey Enquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="bg-[#dad7cd] pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <span>// DIRECT CONCIERGE</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            CONNECT WITH OUR SPECIALISTS
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#dad7cd] max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question regarding high passes, child-friendly mountain routes, or seasonal road openings? We are here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Direct Contact Info & Base Locations */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase font-bold px-2 py-0.5 bg-[#a3b18a] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] text-[#344e41] mb-2">
                <span>// DISPATCH DESK</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase text-[#344e41] mb-2">
                WE ARE ALWAYS A CALL OR MESSAGE AWAY.
              </h2>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                Our operations coordinators are based right in the hill states, tracking weather conditions, pass openings, and road permits in real time.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3 font-mono">
              <div className="p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] flex items-start gap-3">
                <div className="w-9 h-9 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#344e41]">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#344e41]/60 block">
                    Phone Inquiries
                  </span>
                  <a href="tel:+919876543210" className="font-bold text-sm text-[#344e41] hover:underline">
                    +91 98765 43210 (Demo)
                  </a>
                  <p className="text-[11px] text-[#344e41]/70 mt-0.5">Mon to Sat, 9:00 AM – 7:30 PM IST</p>
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] flex items-start gap-3">
                <div className="w-9 h-9 border-2 border-[#344e41] bg-[#3a5a40] text-white flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#344e41]">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#344e41]/60 block">
                    WhatsApp Travel Desk
                  </span>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Mountain%20and%20Memories,%20I%20have%20an%20enquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-[#344e41] hover:underline flex items-center gap-1"
                  >
                    <span>+91 98765 43210</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#588157]" />
                  </a>
                  <p className="text-[11px] text-[#344e41]/70 mt-0.5">Instant messaging &amp; consultations</p>
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] flex items-start gap-3">
                <div className="w-9 h-9 border-2 border-[#344e41] bg-[#a3b18a] text-[#344e41] flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#344e41]">
                  <Mail className="w-4 h-4 text-[#344e41]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#344e41]/60 block">
                    Email Correspondence
                  </span>
                  <a href="mailto:concierge@mountainandmemories.demo" className="font-bold text-xs sm:text-sm text-[#344e41] hover:underline block truncate">
                    concierge@mountainandmemories.demo
                  </a>
                  <p className="text-[11px] text-[#344e41]/70 mt-0.5">Response within 12 operational hours</p>
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] flex items-start gap-3">
                <div className="w-9 h-9 border-2 border-[#344e41] bg-[#dad7cd] text-[#344e41] flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#344e41]">
                  <MapPin className="w-4 h-4 text-[#344e41]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#344e41]/60 block">
                    Base Hubs
                  </span>
                  <p className="font-bold text-xs text-[#344e41]">
                    Old Manali, HP &bull; Dehradun, UK
                  </p>
                  <p className="text-[11px] text-[#344e41]/70 mt-0.5">Logistical basecamp centers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-none p-6 sm:p-8 border-2 border-[#344e41] shadow-[5px_5px_0px_0px_#344e41]">
              
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-2 border-[#344e41] bg-[#588157] text-white mx-auto flex items-center justify-center mb-3 shadow-[2px_2px_0px_#344e41]">
                    <Check className="w-6 h-6" />
                  </div>
                  <span className="font-mono px-2 py-0.5 text-xs font-bold uppercase bg-[#a3b18a] text-[#344e41] border border-[#344e41] inline-block mb-2">
                    Prototype Demo
                  </span>
                  <h3 className="font-serif text-2xl font-black uppercase text-[#344e41]">
                    Message Logged Successfully!
                  </h3>
                  <p className="font-mono text-xs text-[#344e41]/80 max-w-md mx-auto mt-2 leading-relaxed">
                    Thank you for reaching out, <strong>{formData.name}</strong>. Your enquiry for <em>"{formData.subject}"</em> has been received in this demonstration prototype.
                  </p>
                  <div className="mt-5">
                    <Button onClick={() => setFormSubmitted(false)} variant="secondary" size="md">
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-black uppercase text-[#344e41]">
                      Send Us a Direct Message
                    </h3>
                    <p className="font-mono text-xs text-[#344e41]/70 mt-0.5">
                      Fill out the form below and our itinerary specialist will respond promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase text-[#344e41] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Roy"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase text-[#344e41] mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase text-[#344e41] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase text-[#344e41] mb-1">
                      Subject / Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none cursor-pointer"
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
                    <label className="block font-mono text-[11px] font-bold uppercase text-[#344e41] mb-1">
                      Your Message or Questions
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what you have in mind: preferred months, number of people, or specific requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-[10px] text-[#344e41]/70 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#588157]" />
                      Prototype client message
                    </span>

                    <Button type="submit" variant="primary" size="md" icon={Send} iconPosition="right">
                      Send Enquiry
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
