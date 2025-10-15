'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { useEffect, useRef } from 'react';

interface CheckItemProps {
  checkName: string;
  available: boolean;
  checked: boolean;
  selected?: boolean;
}

export function CheckItem({ checkName, available, checked, selected = false }: CheckItemProps) {
  const { toggleCheck } = useChecklist();
  const elementRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected item with padding below
  useEffect(() => {
    if (selected && elementRef.current) {
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if element is not in view or too close to bottom
      const BOTTOM_PADDING = 200; // pixels of space to keep below cursor
      if (rect.bottom > windowHeight - BOTTOM_PADDING || rect.top < 100) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [selected]);

  return (
    <div ref={elementRef} className="flex items-center gap-3 mb-2">
      <label className={`flex items-center gap-3 cursor-pointer p-1 rounded transition-colors w-full ${
        selected
          ? 'bg-yellow-300 border-2 border-yellow-600'
          : available ? 'hover:bg-gray-100' : 'bg-red-100'
      }`}>
        <div className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${
          checked
            ? 'bg-green-600 border-green-700'
            : 'bg-white border-gray-400'
        }`}>
          {checked && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleCheck(checkName)}
          className="hidden"
        />
        <span className={`${available ? 'text-black font-medium' : 'text-red-800 font-medium'}`}>
          {checkName}
        </span>
      </label>
    </div>
  );
}
