'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { useEffect, useRef } from 'react';

interface CheckItemProps {
  checkName: string;
  available: boolean;
  checked: boolean;
  selected?: boolean;
  itemName?: string;
}

export function CheckItem({ checkName, available, checked, selected = false, itemName }: CheckItemProps) {
  const { toggleCheck, filter } = useChecklist();
  const elementRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected item with padding below
  useEffect(() => {
    if (selected && elementRef.current) {
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate element's position from top of document
      const elementTopFromDocument = window.scrollY + rect.top;

      // Dynamically calculate sticky header height
      const stickyHeader = document.querySelector('.card-header');
      const headerHeight = stickyHeader ? stickyHeader.getBoundingClientRect().height : 0;
      const TOP_PADDING = 20; // Additional padding below the sticky header
      const BOTTOM_PADDING = 200; // pixels of space to keep below cursor
      const SCROLL_TO_TOP_THRESHOLD = 400; // If element is within this many pixels from document top, scroll to top

      const effectiveTopBoundary = headerHeight + TOP_PADDING;

      // Check if element is not in view or obscured by sticky header
      if (rect.bottom > windowHeight - BOTTOM_PADDING || rect.top < effectiveTopBoundary) {
        // If element is near the top of the document, just scroll all the way to top
        if (elementTopFromDocument < SCROLL_TO_TOP_THRESHOLD) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
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
          <span className={checked ? 'check-name-strikethrough' : ''}>
            {checkName.replace(/_/g, ' ')}
          </span>
          {checked && itemName && filter.showCheckItems && (
            <span className="check-item-reward"> → {itemName.replace(/_/g, ' ')}</span>
          )}
        </span>
      </label>
    </div>
  );
}
