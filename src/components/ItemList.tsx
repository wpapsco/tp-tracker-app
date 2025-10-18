'use client';

import { useChecklist } from '@/contexts/ChecklistContext';
import { useEffect, useRef } from 'react';

export function ItemList() {
  const { heldItems, filter } = useChecklist();
  const containerRef = useRef<HTMLDivElement>(null);

  // Right analog stick scrolling
  useEffect(() => {
    if (typeof window === 'undefined' || !filter.showItemList) return;

    let animationFrameId: number;
    const SCROLL_SPEED = 10; // pixels per frame when analog is fully tilted

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gamepad = Array.from(gamepads).find(gp => gp !== null);

      if (gamepad && containerRef.current) {
        // Right analog stick - typically axes[2] (horizontal) and axes[3] (vertical)
        const rightAnalogY = gamepad.axes[3] || 0;

        // Apply deadzone
        if (Math.abs(rightAnalogY) > 0.2) {
          containerRef.current.scrollTop += rightAnalogY * SCROLL_SPEED;
        }
      }

      animationFrameId = requestAnimationFrame(pollGamepad);
    };

    animationFrameId = requestAnimationFrame(pollGamepad);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [filter.showItemList]);

  if (!filter.showItemList) return null;

  // Custom sorting: Key items first, then keys grouped, then other items, consumables last
  const getItemPriority = (itemName: string): number => {
    const name = itemName.toLowerCase();

    // Consumables and refills (lowest priority)
    if (name.includes('rupee') || name.includes('bomb_bag') || name.includes('arrow') ||
        name.includes('water_bomb') || name.includes('bomblings') || name.includes('poe_soul')) {
      return 3;
    }

    // Key progression items (highest priority) - check before keys to avoid false positives
    const keyItems = [
      'bow', 'boomerang', 'iron_boots', 'hookshot', 'clawshot', 'spinner', 'ball_and_chain',
      'dominion_rod', 'slingshot', 'fishing_rod', 'lantern', 'sword', 'shield', 'armor',
      'progressive', 'fused_shadow', 'mirror_shard', 'vessel', 'coral_earring', 'hawkeye',
      'gate_keys', 'letter', 'invoice', 'wooden_statue', 'reins', 'charm', 'book'
    ];

    if (keyItems.some(item => name.includes(item))) {
      return 0;
    }

    // Keys (high priority, grouped together)
    if (name.includes('small_key') || name.includes('big_key') ||
        (name.includes('key') && !name.includes('gate_keys'))) {
      return 1;
    }

    // Regular items (middle priority)
    return 2;
  };

  const items = Object.entries(heldItems)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => {
      const priorityA = getItemPriority(a[0]);
      const priorityB = getItemPriority(b[0]);

      // First sort by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Within same priority, sort alphabetically
      return a[0].localeCompare(b[0]);
    });

  if (items.length === 0) {
    return (
      <div ref={containerRef} className="item-list-container">
        <h3 className="item-list-title">Items Held</h3>
        <div className="item-list-empty">No items collected yet</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="item-list-container">
      <h3 className="item-list-title">Items Held ({items.length})</h3>
      <div className="item-list-content">
        {items.map(([itemName, count]) => (
          <div key={itemName} className="item-list-entry">
            <span className="item-list-name">{itemName.replace(/_/g, ' ')}</span>
            {count > 1 && <span className="item-list-count">x{count}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
