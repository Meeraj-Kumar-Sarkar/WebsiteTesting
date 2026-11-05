import React from 'react';
import { Check, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function AccommodationSelector({
  options = [],
  selectedTier,
  onSelectTier,
  travellerCount = 2
}) {
  const currentOption = options.find((opt) => opt.tier === selectedTier) || options[0];

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-cream/90 backdrop-blur-md rounded-2xl border border-bark/15 p-5 sm:p-6 shadow-nature-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-bark/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fern"></span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-soil">
              Select Stay Tier
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-soil/70 mt-1">
            Prices adapt automatically. All categories represent certified Himalayan hospitality.
          </p>
        </div>

        <div className="text-left sm:text-right bg-white/60 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
          <span className="text-xs text-soil/60 block font-medium">Calculated Rate</span>
          <div className="text-xl sm:text-2xl font-bold font-serif text-pine">
            {currentOption?.available ? formatPrice(currentOption.pricePerPerson) : 'Tier Unavailable'}
            <span className="text-xs font-normal text-soil/60 font-sans"> / person</span>
          </div>
        </div>
      </div>

      {/* Tier Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-5">
        {options.map((option) => {
          const isSelected = selectedTier === option.tier;
          const isAvailable = option.available;

          return (
            <button
              key={option.tier}
              type="button"
              onClick={() => isAvailable && onSelectTier(option.tier)}
              disabled={!isAvailable}
              className={`text-left p-4 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                !isAvailable
                  ? 'border-bark/10 bg-beige/30 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'border-pine bg-pine text-cream shadow-nature-md scale-[1.01]'
                  : 'border-bark/15 bg-white/80 hover:bg-beige/40 text-soil hover:border-bark/30 hover:shadow-nature-sm cursor-pointer'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-cream/20 text-cream' : 'bg-sage/20 text-pine'
                  }`}>
                    {option.tier}
                  </span>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-cream text-pine flex items-center justify-center font-bold shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="text-[10px] font-medium text-soil/60 bg-beige/60 px-2 py-0.5 rounded-full">
                      N/A in zone
                    </span>
                  )}
                </div>

                <div className={`font-serif text-base font-bold leading-snug ${isSelected ? 'text-cream' : 'text-soil'}`}>
                  {option.name}
                </div>

                <div className="mt-2.5 text-xs font-medium">
                  {isAvailable ? (
                    <span>
                      <strong className="text-sm">{formatPrice(option.pricePerPerson)}</strong>{' '}
                      <span className={`text-[11px] ${isSelected ? 'text-cream/80' : 'text-soil/60'}`}>/ pax</span>
                    </span>
                  ) : (
                    <span className={`text-[11px] ${isSelected ? 'text-cream/70' : 'text-soil/60'}`}>Eco restrictions apply</span>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-cream/20 flex items-center gap-1.5 text-xs font-medium text-sage">
                  <Sparkles className="w-3.5 h-3.5 text-sage" />
                  <span>Selected Tier</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Details Box for Selected Option */}
      <div className="p-4 rounded-xl bg-beige/30 border border-bark/15 text-soil">
        {currentOption?.available ? (
          <div>
            <div className="flex items-start gap-2.5 mb-2.5">
              <div className="w-6 h-6 rounded-full bg-sage/20 text-pine flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 text-pine" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pine">
                  Included in {currentOption.name} ({currentOption.tier}) tier:
                </h4>
                <p className="text-xs text-soil/80 mt-0.5 leading-relaxed font-sans">
                  {currentOption.description}
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-8 text-xs text-soil/85">
              {currentOption.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-sage/30 text-pine flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 text-xs text-soil/90">
            <AlertCircle className="w-4 h-4 text-fern mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block mb-0.5 text-soil">Ecological Availability Notice:</span>
              <p className="text-soil/75">{currentOption?.unavailableReason || 'This tier is not offered for this remote mountain zone to minimize environmental impact.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
