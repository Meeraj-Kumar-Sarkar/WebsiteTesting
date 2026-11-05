import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Send, AlertCircle, Compass, ShieldCheck } from 'lucide-react';
import { destinations } from '../../data/destinations';
import Button from '../common/Button';

const inputCls = (hasError) =>
  `w-full px-4 py-2.5 text-sm bg-beige border rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-fern/30 transition ${
    hasError ? 'border-red-400' : 'border-bark/30'
  }`;

const chipCls = (active) =>
  `p-2.5 rounded-xl border text-xs font-medium text-left transition-all duration-150 cursor-pointer ${
    active
      ? 'bg-pine text-cream border-pine shadow-nature-sm'
      : 'bg-beige text-soil border-bark/25 hover:border-sage hover:bg-sage/10'
  }`;

export default function CustomizeTripForm({ initialDestination = '', initialStay = '' }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    destination: initialDestination || 'himachal-pradesh',
    customDestinationNotes: initialStay ? `Including stay at ${initialStay}` : '',
    startDate: '',
    endDate: '',
    duration: '7-9 Days',
    travellers: '2 Adults',
    budgetPerPerson: '₹35,000 – ₹50,000',
    accommodationTier: '4-star',
    activities: ['Scenic High Pass Drives', 'Local Homestays & Regional Food'],
    additionalNotes: initialStay ? `Preferred Stay / Property: ${initialStay}` : '',
    fullName: '',
    phone: '',
    email: '',
    contactPreference: 'WhatsApp',
  });

  const availableActivities = [
    'Scenic High Pass Drives',
    'Monastery & Heritage Culture',
    'Day Treks & Alpine Walks',
    'Local Homestays & Regional Food',
    'Stargazing & Remote Glamping',
    'Photography Masterclasses',
    'Flora & Wildlife Sanctuary Walks',
    'Relaxed Riverside Reading',
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleActivityToggle = (act) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(act)
        ? prev.activities.filter((a) => a !== act)
        : [...prev.activities, act],
    }));
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!formData.destination) e.destination = 'Please choose a preferred destination.';
      if (!formData.startDate)   e.startDate   = 'Please select an approximate start date.';
      if (!formData.duration)    e.duration    = 'Please specify ideal duration.';
      if (!formData.travellers)  e.travellers  = 'Please specify number of travellers.';
    }
    if (step === 2 && formData.activities.length === 0) {
      e.activities = 'Please select at least one activity.';
    }
    if (step === 3) {
      if (!formData.fullName.trim()) e.fullName = 'Please enter your name.';
      if (!formData.phone.trim() || formData.phone.length < 8) e.phone = 'Please enter a valid phone number.';
      if (!formData.email.trim() || !formData.email.includes('@')) e.email = 'Please enter a valid email address.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep((p) => Math.min(p + 1, 3)); };
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateStep(3)) return;
    try {
      await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName, email: formData.email, phone: formData.phone, source: 'WEBSITE',
          notes: [
            `Destination: ${formData.destination}`,
            formData.customDestinationNotes && `Notes: ${formData.customDestinationNotes}`,
            `Start Date: ${formData.startDate}`, `Duration: ${formData.duration}`,
            `Travellers: ${formData.travellers}`, `Budget/person: ${formData.budgetPerPerson}`,
            `Accommodation: ${formData.accommodationTier}`, `Activities: ${formData.activities.join(', ')}`,
            formData.additionalNotes && `Additional: ${formData.additionalNotes}`,
            `Contact Preference: ${formData.contactPreference}`,
          ].filter(Boolean).join('\n'),
        }),
      });
    } catch { /* backend may not be running in dev */ }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false); setCurrentStep(1);
    setFormData({
      destination: 'himachal-pradesh', customDestinationNotes: '', startDate: '', endDate: '',
      duration: '7-9 Days', travellers: '2 Adults', budgetPerPerson: '₹35,000 – ₹50,000',
      accommodationTier: '4-star', activities: ['Scenic High Pass Drives', 'Local Homestays & Regional Food'],
      additionalNotes: '', fullName: '', phone: '', email: '', contactPreference: 'WhatsApp',
    });
  };

  if (isSubmitted) {
    return (
      <div className="p-6 sm:p-10 text-center max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-fern/20 text-fern mx-auto flex items-center justify-center mb-5">
          <Check className="w-7 h-7" />
        </div>
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-sage/20 text-pine border border-sage/40 mb-3">
          Prototype Demo
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-soil">Trip Blueprint Requested!</h3>
        <p className="mt-2 text-sm text-soil/70 leading-relaxed max-w-lg mx-auto">
          Thank you, <strong>{formData.fullName}</strong>. Your custom travel blueprint has been logged locally.
        </p>

        {/* Summary */}
        <div className="my-6 p-4 bg-beige rounded-xl border border-bark/20 text-left text-sm space-y-1.5 text-soil">
          <div className="font-semibold text-pine pb-1.5 border-b border-bark/20">Summary of your request</div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div><span className="text-soil/50">Destination:</span> <strong>{destinations.find(d => d.slug === formData.destination)?.name || formData.destination}</strong></div>
            <div><span className="text-soil/50">Duration:</span> <strong>{formData.duration}</strong></div>
            <div><span className="text-soil/50">Travellers:</span> <strong>{formData.travellers}</strong></div>
            <div><span className="text-soil/50">Stay Tier:</span> <strong>{formData.accommodationTier} Tier</strong></div>
            <div><span className="text-soil/50">Budget:</span> <strong>{formData.budgetPerPerson}</strong></div>
            <div><span className="text-soil/50">Start Date:</span> <strong>{formData.startDate || 'Flexible'}</strong></div>
          </div>
          <div className="pt-1.5 border-t border-bark/15 text-xs"><span className="text-soil/50">Highlights:</span> {formData.activities.join(', ')}</div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-soil/60 mb-5">
          <ShieldCheck className="w-4 h-4 text-fern" />
          <span><strong>Note:</strong> This form demonstrates client-side progression. No live booking is dispatched.</span>
        </div>

        <Button onClick={handleReset} variant="secondary" size="md">Plan Another Trip</Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Step header */}
      <div className="bg-pine px-5 py-5 text-cream rounded-t-2xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-medium text-sage uppercase tracking-widest">
              Step {currentStep} of 3
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-cream mt-0.5">
              {currentStep === 1 && 'Where & When Do You Wish to Journey?'}
              {currentStep === 2 && 'Comfort, Pace & Mountain Experiences'}
              {currentStep === 3 && 'Review & Contact Details'}
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-cream bg-pine/50 border border-cream/20 rounded-organic px-3 py-1.5">
            <Compass className="w-3.5 h-3.5 text-sage" />Custom Route
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-cream/20 h-2 rounded-full overflow-hidden">
          <div className="bg-sage h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 3) * 100}%` }} />
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="px-1 space-y-5">

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Preferred Region / State *</label>
              <select
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className={inputCls(errors.destination)}
              >
                <option value="open">Open to suggestions / Guide me</option>
                {destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name} ({d.idealDuration})</option>)}
              </select>
              {errors.destination && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.destination}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Start Date *</label>
                <input type="date" value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className={inputCls(errors.startDate)} />
                {errors.startDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Trip Duration *</label>
                <select value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} className={inputCls(false)}>
                  <option value="5-6 Days">5–6 Days (Short Break)</option>
                  <option value="7-9 Days">7–9 Days (Recommended)</option>
                  <option value="10-12 Days">10–12 Days (Deep Exploration)</option>
                  <option value="14+ Days">14+ Days (Grand Circuit)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Number of Travellers *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Solo Explorer', '2 Adults', 'Small Family (3-4)', 'Group (5+)'].map((opt) => (
                  <button key={opt} type="button" onClick={() => handleInputChange('travellers', opt)} className={chipCls(formData.travellers === opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Preferred Accommodation</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: '3-star',   label: '3-Star',   sub: 'Homestays'           },
                  { id: '4-star',   label: '4-Star',   sub: 'Eco-Lodges'          },
                  { id: '5-star',   label: '5-Star',   sub: 'Resorts & Glamping'  },
                  { id: 'flexible', label: 'Flexible', sub: 'Authentic & Luxury'  },
                ].map((tier) => (
                  <button key={tier.id} type="button" onClick={() => handleInputChange('accommodationTier', tier.id)} className={chipCls(formData.accommodationTier === tier.id)}>
                    <span className="block font-semibold">{tier.label}</span>
                    <span className="text-[10px] opacity-75 block mt-0.5">{tier.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Budget per Person</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['Under ₹30,000', '₹30,000 – ₹50,000', '₹50,000+ (Premium)'].map((b) => (
                  <button key={b} type="button" onClick={() => handleInputChange('budgetPerPerson', b)} className={chipCls(formData.budgetPerPerson === b)}>{b}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Experiences & Activities *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableActivities.map((act) => {
                  const checked = formData.activities.includes(act);
                  return (
                    <button key={act} type="button" onClick={() => handleActivityToggle(act)} className={`flex items-center gap-2 ${chipCls(checked)}`}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${checked ? 'bg-cream border-cream' : 'bg-beige border-bark/30'}`}>
                        {checked && <Check className="w-2.5 h-2.5 text-pine" />}
                      </div>
                      <span>{act}</span>
                    </button>
                  );
                })}
              </div>
              {errors.activities && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.activities}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Special Requests or Notes</label>
              <textarea
                rows={2}
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="E.g., Preferred stay, dietary needs, altitude tolerance..."
                className={inputCls(false)}
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Quick review */}
            <div className="p-4 bg-beige rounded-xl border border-bark/20 space-y-1 text-xs">
              <div className="font-semibold text-pine pb-1.5 border-b border-bark/20 flex items-center justify-between">
                <span>Trip Overview</span>
                <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-fern underline font-semibold cursor-pointer">Edit</button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-soil/70">
                <div><span className="text-soil/50">Region:</span> {formData.destination}</div>
                <div><span className="text-soil/50">Start Date:</span> {formData.startDate || 'Flexible'}</div>
                <div><span className="text-soil/50">Duration:</span> {formData.duration}</div>
                <div><span className="text-soil/50">Travellers:</span> {formData.travellers}</div>
                <div><span className="text-soil/50">Stay Tier:</span> {formData.accommodationTier}</div>
                <div><span className="text-soil/50">Budget:</span> {formData.budgetPerPerson}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Your Full Name *</label>
                <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="e.g. Vikram Sharma" className={inputCls(errors.fullName)} />
                {errors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Phone / WhatsApp *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+91 98765 43210" className={inputCls(errors.phone)} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Email Address *</label>
                  <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="vikram@example.com" className={inputCls(errors.email)} />
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-soil/70 mb-1.5">Preferred Contact Method</label>
                <div className="flex gap-4 text-sm">
                  {['WhatsApp', 'Phone Call', 'Email'].map((method) => (
                    <label key={method} className="flex items-center gap-1.5 cursor-pointer text-soil/80">
                      <input type="radio" name="contactPref" checked={formData.contactPreference === method} onChange={() => handleInputChange('contactPreference', method)} className="accent-fern" />
                      {method}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-soil/60 bg-beige rounded-xl p-3 border border-bark/20">
              <ShieldCheck className="w-4 h-4 text-fern flex-shrink-0" />
              We respect your privacy. No spam. Prototype client-side interaction only.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 pt-4 border-t border-bark/15 flex items-center justify-between">
          {currentStep > 1
            ? <Button type="button" onClick={prevStep} variant="secondary" size="md" icon={ChevronLeft} iconPosition="left">Back</Button>
            : <div />
          }
          {currentStep < 3
            ? <Button type="button" onClick={nextStep} variant="primary" size="md" icon={ChevronRight} iconPosition="right">Next Step</Button>
            : <Button type="submit" variant="gold" size="md" icon={Send} iconPosition="right">Submit Journey Plan</Button>
          }
        </div>
      </form>
    </div>
  );
}
