'use client';

import { useState } from 'react';

export function InfoDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Info Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="info-icon-button"
        aria-label="App Information"
        title="App Information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="info-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h2 className="info-modal-title">About This App</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="info-modal-close"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="info-modal-body">
              <p className="info-modal-text">
                This application was largely developed with the assistance of AI tools
                (Claude Code by Anthropic).
              </p>
              <p className="info-modal-text">
                While every effort has been made to ensure functionality and accuracy,
                please be aware that AI-assisted development was a significant part of
                this project's creation.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
