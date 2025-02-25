import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  'aria-label': string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, 'aria-label': ariaLabel }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 
        border-transparent transition-colors duration-200 ease-in-out focus:outline-none
        ${checked ? 'bg-green-500' : 'bg-gray-200'}
      `}
    >
      <span className="sr-only">{ariaLabel}</span>
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow 
          ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default Switch;