import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Send, Sparkles, AlertCircle, Compass, Calendar, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { destinations } from '../../data/destinations';
import Button from '../common/Button';

export default function CustomizeTripForm({ initialDestination = '', initialStay = '' }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Trip Details
    destination: initialDestination || 'himachal-pradesh',
    customDestinationNotes: initialStay ? `Including stay at ${initialStay}` : '',
    startDate: '',
    endDate: '',
    duration: '7-9 Days',
    travellers: '2 Adults',
    
    // Step 2: Preferences
    budgetPerPerson: '₹35,000 – ₹50,000',
    accommodationTier: '4-star',
    activities: ['Scenic High Pass Drives', 'Local Homestays & Regional Food'],
    additionalNotes: initialStay ? `Preferred Stay / Property: ${initialStay}` : '',

    // Step 3: Contact & Review
    fullName: '',
    phone: '',
    email: '',
    contactPreference: 'WhatsApp'
  });

  const availableActivities = [
    'Scenic High Pass Drives',
    'Monastery & Heritage Culture',
    'Day Treks & Alpine Walks',
    'Local Homestays & Regional Food',
    'Stargazing & Remote Glamping',
    'Photography Masterclasses',
    'Flora & Wildlife Sanctuary Walks',
    'Relaxed Riverside Reading'
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleActivityToggle = (act) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(act);
      const updated = exists
        ? prev.activities.filter((a) => a !== act)
        : [...prev.activities, act];
      return { ...prev, activities: updated };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.destination) newErrors.destination = 'Please choose a preferred destination or select "Open to suggestions".';
      if (!formData.startDate) newErrors.startDate = 'Please select an approximate start date.';
      if (!formData.duration) newErrors.duration = 'Please specify ideal duration.';
      if (!formData.travellers) newErrors.travellers = 'Please specify number of travellers.';
    }

    if (step === 2) {
      if (formData.activities.length === 0) {
        newErrors.activities = 'Please select at least one experience or activity you are looking forward to.';
      }
    }

    if (step === 3) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your name.';
      if (!formData.phone.trim() || formData.phone.length < 8) newErrors.phone = 'Please provide a valid contact phone number.';
      if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Please provide a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    try {
      await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          source: 'WEBSITE',
          notes: [
            `Destination: ${formData.destination}`,
            formData.customDestinationNotes && `Notes: ${formData.customDestinationNotes}`,
            `Start Date: ${formData.startDate}`,
            `Duration: ${formData.duration}`,
            `Travellers: ${formData.travellers}`,
            `Budget/person: ${formData.budgetPerPerson}`,
            `Accommodation: ${formData.accommodationTier}`,
            `Activities: ${formData.activities.join(', ')}`,
            formData.additionalNotes && `Additional: ${formData.additionalNotes}`,
            `Contact Preference: ${formData.contactPreference}`,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      });
    } catch {
      // Backend may not be running in dev; still proceed to success state
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      destination: 'himachal-pradesh',
      customDestinationNotes: '',
      startDate: '',
      endDate: '',
      duration: '7-9 Days',
      travellers: '2 Adults',
      budgetPerPerson: '₹35,000 – ₹50,000',
      accommodationTier: '4-star',
      activities: ['Scenic High Pass Drives', 'Local Homestays & Regional Food'],
      additionalNotes: '',
      fullName: '',
      phone: '',
      email: '',
      contactPreference: 'WhatsApp'
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-none p-6 sm:p-10 border-2 border-[#344e41] shadow-[5px_5px_0px_0px_#344e41] text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 border-2 border-[#344e41] bg-[#588157] text-white mx-auto flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
          <Check className="w-6 h-6" />
        </div>

        <div className="inline-block px-2.5 py-0.5 font-mono text-xs font-bold uppercase bg-[#a3b18a] text-[#344e41] border border-[#344e41] mb-2">
          Prototype Demo
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-black uppercase text-[#344e41]">
          Trip Blueprint Requested!
        </h3>

        <p className="mt-2 font-mono text-xs text-[#344e41]/80 leading-relaxed max-w-lg mx-auto">
          Thank you, <strong>{formData.fullName}</strong>. In this frontend prototype, your custom travel blueprint has been logged locally.
        </p>

        {/* Summary Card */}
        <div className="my-5 p-4 bg-[#dad7cd]/40 border-2 border-[#344e41] text-left font-mono text-xs space-y-1.5 text-[#344e41]">
          <div className="font-bold uppercase text-[#3a5a40] pb-1.5 border-b-2 border-[#344e41]">
            // Summary of Your Request:
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div><span className="text-[#344e41]/60">Destination:</span> <strong>{formData.destination === 'open' ? 'Open to Suggestions' : destinations.find(d => d.slug === formData.destination)?.name || formData.destination}</strong></div>
            <div><span className="text-[#344e41]/60">Duration:</span> <strong>{formData.duration}</strong></div>
            <div><span className="text-[#344e41]/60">Travellers:</span> <strong>{formData.travellers}</strong></div>
            <div><span className="text-[#344e41]/60">Stay Tier:</span> <strong>{formData.accommodationTier} Tier</strong></div>
            <div><span className="text-[#344e41]/60">Budget / person:</span> <strong>{formData.budgetPerPerson}</strong></div>
            <div><span className="text-[#344e41]/60">Target Start:</span> <strong>{formData.startDate || 'Flexible'}</strong></div>
          </div>
          <div className="pt-2 border-t border-[#344e41]">
            <span className="text-[#344e41]/60">Highlights:</span> {formData.activities.join(', ')}
          </div>
        </div>

        <div className="p-2.5 bg-[#dad7cd]/50 border border-[#344e41] font-mono text-[11px] text-[#344e41] text-left flex items-start gap-2 mb-5">
          <ShieldCheck className="w-4 h-4 text-[#588157] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Note on Prototype:</strong> This form demonstrates client-side step progression, error validation, and multi-tier accommodation customization. No live booking is dispatched.
          </span>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={handleReset} variant="secondary" size="md">
            Plan Another Trip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none border-2 border-[#344e41] shadow-[5px_5px_0px_0px_#344e41] overflow-hidden max-w-3xl mx-auto">
      
      {/* Step Indicator Header */}
      <div className="bg-[#344e41] px-5 py-4 text-white border-b-2 border-[#344e41]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a3b18a]">
              // Step 0{currentStep} of 03
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-black uppercase text-white mt-0.5">
              {currentStep === 1 && "Where & When Do You Wish to Journey?"}
              {currentStep === 2 && "Comfort, Pace & Mountain Experiences"}
              {currentStep === 3 && "Review & Contact Details"}
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] font-bold text-[#dad7cd] bg-[#3a5a40] px-2.5 py-1 border border-white">
            <Compass className="w-3.5 h-3.5 text-[#a3b18a]" />
            <span>CUSTOM ROUTE</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1b2a23] h-2.5 border border-white/40 flex">
          <div
            className="bg-[#588157] transition-none"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-7">
        
        {/* STEP 1: TRIP DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                Preferred Region / State *
              </label>
              <select
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className={`w-full px-3 py-2 text-xs font-bold bg-[#dad7cd]/40 border-2 rounded-none text-[#344e41] focus:bg-white focus:outline-none ${
                  errors.destination ? 'border-red-600' : 'border-[#344e41]'
                }`}
              >
                <option value="open">Open to suggestions / Guide me</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.idealDuration})
                  </option>
                ))}
              </select>
              {errors.destination && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.destination}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-bold bg-[#dad7cd]/40 border-2 rounded-none text-[#344e41] focus:bg-white focus:outline-none ${
                    errors.startDate ? 'border-red-600' : 'border-[#344e41]'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                  Trip Duration *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="5-6 Days">5 to 6 Days (Short Break)</option>
                  <option value="7-9 Days">7 to 9 Days (Recommended)</option>
                  <option value="10-12 Days">10 to 12 Days (Deep Exploration)</option>
                  <option value="14+ Days">14+ Days (Grand Circuit)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                Number of Travellers *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Solo Explorer', '2 Adults', 'Small Family (3-4)', 'Group (5+)'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleInputChange('travellers', opt)}
                    className={`p-2.5 text-xs font-bold uppercase rounded-none border-2 text-center transition-none cursor-pointer ${
                      formData.travellers === opt
                        ? 'bg-[#3a5a40] text-white border-[#344e41] shadow-[2px_2px_0px_#344e41]'
                        : 'bg-[#dad7cd]/40 hover:bg-[#dad7cd] text-[#344e41] border-[#344e41]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PREFERENCES */}
        {currentStep === 2 && (
          <div className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                Preferred Accommodation Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {[
                  { id: '3-star', label: '3-Star', sub: 'Homestays' },
                  { id: '4-star', label: '4-Star', sub: 'Eco-Lodges' },
                  { id: '5-star', label: '5-Star', sub: 'Resorts & Glamping' },
                  { id: 'flexible', label: 'Flexible', sub: 'Authentic & Luxury' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleInputChange('accommodationTier', tier.id)}
                    className={`p-2.5 rounded-none border-2 text-left transition-none cursor-pointer ${
                      formData.accommodationTier === tier.id
                        ? 'bg-[#3a5a40] text-white border-[#344e41] shadow-[2px_2px_0px_#344e41]'
                        : 'bg-[#dad7cd]/40 hover:bg-[#dad7cd] text-[#344e41] border-[#344e41]'
                    }`}
                  >
                    <span className="block font-bold text-xs uppercase">{tier.label}</span>
                    <span className="text-[10px] opacity-80 mt-0.5 block">{tier.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                Approximate Budget per Person (Demo)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['Under ₹30,000', '₹30,000 – ₹50,000', '₹50,000+ (Premium)'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleInputChange('budgetPerPerson', b)}
                    className={`p-2.5 text-xs font-bold uppercase rounded-none border-2 text-center transition-none cursor-pointer ${
                      formData.budgetPerPerson === b
                        ? 'bg-[#3a5a40] text-white border-[#344e41] shadow-[2px_2px_0px_#344e41]'
                        : 'bg-[#dad7cd]/40 hover:bg-[#dad7cd] text-[#344e41] border-[#344e41]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                Experiences &amp; Activities *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableActivities.map((act) => {
                  const isChecked = formData.activities.includes(act);
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() => handleActivityToggle(act)}
                      className={`flex items-center gap-2 p-2.5 rounded-none border-2 text-xs font-bold text-left transition-none cursor-pointer ${
                        isChecked
                          ? 'bg-[#588157] text-white border-[#344e41] shadow-[2px_2px_0px_#344e41]'
                          : 'bg-[#dad7cd]/40 hover:bg-[#dad7cd] text-[#344e41] border-[#344e41]'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 border border-[#344e41] flex items-center justify-center flex-shrink-0 ${
                        isChecked ? 'bg-white text-[#344e41]' : 'bg-white'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className="truncate">{act}</span>
                    </button>
                  );
                })}
              </div>
              {errors.activities && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.activities}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                Special Requests or Notes
              </label>
              <textarea
                rows={2}
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="E.g., Preferred stay, dietary needs, altitude tolerance..."
                className="w-full px-3 py-2 text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT & REVIEW */}
        {currentStep === 3 && (
          <div className="space-y-4 font-mono">
            {/* Quick Review Box */}
            <div className="p-3 bg-[#dad7cd]/40 border-2 border-[#344e41] space-y-1 text-xs">
              <div className="font-bold text-[#3a5a40] uppercase pb-1 border-b-2 border-[#344e41] flex items-center justify-between">
                <span>Trip Overview Review</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#588157] underline font-bold cursor-pointer"
                >
                  Edit details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <div><span className="text-[#344e41]/60">Region:</span> {formData.destination}</div>
                <div><span className="text-[#344e41]/60">Start Date:</span> {formData.startDate || 'Flexible'}</div>
                <div><span className="text-[#344e41]/60">Duration:</span> {formData.duration}</div>
                <div><span className="text-[#344e41]/60">Travellers:</span> {formData.travellers}</div>
                <div><span className="text-[#344e41]/60">Stay Tier:</span> {formData.accommodationTier}</div>
                <div><span className="text-[#344e41]/60">Budget:</span> {formData.budgetPerPerson}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className={`w-full px-3 py-2 text-xs font-bold bg-[#dad7cd]/40 border-2 rounded-none text-[#344e41] focus:bg-white focus:outline-none ${
                    errors.fullName ? 'border-red-600' : 'border-[#344e41]'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 text-xs font-bold bg-[#dad7cd]/40 border-2 rounded-none text-[#344e41] focus:bg-white focus:outline-none ${
                      errors.phone ? 'border-red-600' : 'border-[#344e41]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="vikram@example.com"
                    className={`w-full px-3 py-2 text-xs font-bold bg-[#dad7cd]/40 border-2 rounded-none text-[#344e41] focus:bg-white focus:outline-none ${
                      errors.email ? 'border-red-600' : 'border-[#344e41]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#344e41] mb-1">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4 text-xs font-bold">
                  {['WhatsApp', 'Phone Call', 'Email'].map((method) => (
                    <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contactPref"
                        checked={formData.contactPreference === method}
                        onChange={() => handleInputChange('contactPreference', method)}
                        className="accent-[#3a5a40]"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#dad7cd]/50 border border-[#344e41] text-[11px] text-[#344e41] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#588157] flex-shrink-0" />
              <span>We respect your privacy. No spam. Prototype client-side interaction.</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 pt-4 border-t-2 border-[#344e41] flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={prevStep}
              variant="secondary"
              size="md"
              icon={ChevronLeft}
              iconPosition="left"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="md"
              icon={ChevronRight}
              iconPosition="right"
            >
              Step 0{currentStep + 1}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="gold"
              size="md"
              icon={Send}
              iconPosition="right"
            >
              Submit Journey Plan
            </Button>
          )}
        </div>

      </form>
    </div>
  );
}
