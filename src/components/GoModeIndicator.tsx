'use client';

interface GoModeIndicatorProps {
  isGoMode: boolean;
}

export function GoModeIndicator({ isGoMode }: GoModeIndicatorProps) {
  if (!isGoMode) return null;

  return (
    <div className="go-mode-container">
      <div className="go-mode-rays">
        {/* Create 12 rotating rays */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="go-mode-ray"
            style={{ transform: `rotate(${i * 30}deg)` }}
          />
        ))}
      </div>
      <div className="go-mode-content">
        <div className="go-mode-title">GO MODE</div>
      </div>
    </div>
  );
}
