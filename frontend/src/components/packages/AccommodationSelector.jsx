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
    <div className="bg-white rounded-none border-2 border-[#344e41] p-5 sm:p-6 shadow-[3px_3px_0px_0px_#344e41] font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#344e41]">
        <div>
          <h3 className="font-serif text-xl font-black uppercase text-[#344e41] flex items-center gap-2">
            <span>// SELECT STAY TIER</span>
          </h3>
          <p className="text-xs text-[#344e41]/70 mt-0.5 font-bold">
            Prices adapt automatically. All categories represent certified Himalayan comfort.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] text-[#344e41]/60 block uppercase font-bold">Calculated Rate</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#3a5a40]">
            {currentOption?.available ? formatPrice(currentOption.pricePerPerson) : 'Tier Unavailable'}
            <span className="text-[10px] text-[#344e41]/60 font-normal"> / person</span>
          </div>
        </div>
      </div>

      {/* Tier Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        {options.map((option) => {
          const isSelected = selectedTier === option.tier;
          const isAvailable = option.available;

          return (
            <button
              key={option.tier}
              type="button"
              onClick={() => isAvailable && onSelectTier(option.tier)}
              disabled={!isAvailable}
              className={`text-left p-3.5 rounded-none border-2 transition-none relative flex flex-col justify-between ${
                !isAvailable
                  ? 'border-[#344e41]/40 bg-[#dad7cd]/40 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'border-[#344e41] bg-[#3a5a40] text-white shadow-[3px_3px_0px_#344e41]'
                  : 'border-[#344e41] bg-[#dad7cd]/30 hover:bg-[#dad7cd] text-[#344e41] cursor-pointer'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 border ${
                    isSelected ? 'bg-white text-[#344e41] border-white' : 'bg-[#dad7cd] text-[#344e41] border-[#344e41]'
                  }`}>
                    {option.tier}
                  </span>

                  {isSelected && (
                    <span className="w-4 h-4 border border-white bg-white text-[#344e41] flex items-center justify-center font-bold">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="text-[9px] font-bold text-[#344e41]/70 bg-[#dad7cd] px-1 py-0.5">
                      N/A in zone
                    </span>
                  )}
                </div>

                <div className="font-serif font-black text-base uppercase leading-snug">
                  {option.name}
                </div>

                <div className="mt-2 text-xs font-bold">
                  {isAvailable ? (
                    <span>{formatPrice(option.pricePerPerson)} <span className="text-[10px] font-normal opacity-80">/ pax</span></span>
                  ) : (
                    <span className="text-[10px] opacity-70">Eco restrictions apply</span>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 pt-1.5 border-t border-white/30 flex items-center gap-1 text-[10px] font-bold text-[#a3b18a]">
                  <Sparkles className="w-3 h-3 text-[#a3b18a]" />
                  <span>SELECTED TIER</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Details Box for Selected Option */}
      <div className="p-3.5 bg-[#dad7cd]/40 border-2 border-[#344e41]">
        {currentOption?.available ? (
          <div>
            <div className="flex items-start gap-2 mb-2">
              <Info className="w-4 h-4 text-[#588157] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase text-[#344e41]">
                  Included in {currentOption.name} ({currentOption.tier}) tier:
                </h4>
                <p className="text-[11px] text-[#344e41]/80 mt-0.5 leading-relaxed">
                  {currentOption.description}
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 pl-6 text-xs text-[#344e41]">
              {currentOption.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-[#588157] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-xs text-[#344e41]">
            <AlertCircle className="w-4 h-4 text-[#588157] mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold uppercase block mb-0.5">Ecological Availability Notice:</span>
              <p>{currentOption?.unavailableReason || 'This tier is not offered for this remote mountain zone to minimize environmental impact.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
