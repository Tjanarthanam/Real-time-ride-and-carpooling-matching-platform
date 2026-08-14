import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { suggestLocations } from '../api/routingApi';

/**
 * Drop-in replacement for a plain text <input> that shows a live dropdown
 * of matching places as the user types (debounced, backed by
 * GET /api/routes/suggest -> Nominatim on the backend).
 *
 * Selecting a suggestion (or just typing and blurring) behaves exactly like
 * a normal text field from the parent's point of view — it only ever calls
 * onChange(newValue), so no other logic in the parent form needs to change.
 */
export default function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  inputClassName,
  name,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (newValue.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await suggestLocations(newValue);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 350);
  };

  const handleSelect = (place) => {
    // Keep just the first, short segment of the full address as the field
    // value (e.g. "Reggio nell'Emilia" instead of the full comma-separated
    // display name) — matches what a driver/passenger would actually type.
    const shortName = place.displayName.split(',')[0].trim();
    onChange(shortName);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={inputClassName}
      />

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[320px] max-w-[90vw] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl py-2 z-50 max-h-72 overflow-y-auto">
          {loading && (
            <p className="px-4 py-2 text-xs font-semibold text-slate-400">Searching…</p>
          )}
          {!loading && suggestions.map((place, idx) => {
            const parts = place.displayName.split(',');
            const title = parts[0].trim();
            const subtitle = parts.slice(1).join(',').trim();
            return (
              <button
                type="button"
                key={`${place.lat}-${place.lon}-${idx}`}
                onClick={() => handleSelect(place)}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-start gap-3"
              >
                <MapPin className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                <span>
                  <span className="block text-sm font-bold text-slate-900">{title}</span>
                  {subtitle && (
                    <span className="block text-xs text-slate-400 font-medium">{subtitle}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
