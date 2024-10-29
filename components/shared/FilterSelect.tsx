import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const FilterSelect = ({ options, value, onChange }: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-6 md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-[var(--eerie-black-2)] 
        text-[var(--light-gray)] p-3 border border-[var(--jet)] rounded-xl text-sm"
      >
        <span>{value}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-[var(--eerie-black-2)] 
        border border-[var(--jet)] rounded-xl overflow-hidden z-10">
          {options.map((option) => (
            <li key={option}>
              <button
                className="w-full text-left p-3 text-sm text-[var(--light-gray)] 
                hover:bg-[var(--jet)] transition-colors"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};