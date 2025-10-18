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

      // Dynamically calculate sticky header height
      const stickyHeader = document.querySelector('.card-header');
      const headerHeight = stickyHeader ? stickyHeader.getBoundingClientRect().height : 0;
      const TOP_PADDING = 20; // Additional padding below the sticky header
      const BOTTOM_PADDING = 200; // pixels of space to keep below cursor

      const effectiveTopBoundary = headerHeight + TOP_PADDING;

      // Check if element is not in view or obscured by sticky header
      if (rect.bottom > windowHeight - BOTTOM_PADDING || rect.top < effectiveTopBoundary) {
        // Scroll into view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // After scrollIntoView, ensure element isn't behind the sticky header
        setTimeout(() => {
          const newRect = element.getBoundingClientRect();
          if (newRect.top < effectiveTopBoundary) {
            // Element is behind header, manually adjust scroll
            const scrollAdjustment = effectiveTopBoundary - newRect.top;
            window.scrollBy({
              top: -scrollAdjustment,
              behavior: 'smooth'
            });
          }
        }, 100); // Small delay to let scrollIntoView settle
      }
    }
  }, [selected]);

  const getLabelClasses = () => {
    if (selected) return 'check-item-label check-item-selected';
    if (available) return 'check-item-label check-item-hover-available';
    return 'check-item-label check-item-unavailable-bg';
  };

  const getCheckboxClasses = () => {
    return checked ? 'checkbox-visual checkbox-checked' : 'checkbox-visual checkbox-unchecked';
  };

  const getTextClasses = () => {
    const baseClass = available ? 'check-item-available' : 'check-item-unavailable';
    return checked ? `${baseClass} check-item-checked` : baseClass;
  };

  return (
    <div ref={elementRef} className="check-item-container">
      <label className={getLabelClasses()}>
        <div className={getCheckboxClasses()}>
          {checked && (
            <svg className="checkbox-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleCheck(checkName)}
          className="checkbox-input-hidden"
        />
        <span className={getTextClasses()}>
          {checkName}
        </span>
      </label>
    </div>
  );
}
