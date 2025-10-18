'use client';

import { useState, useEffect, useRef } from 'react';
import { useChecklist } from '@/contexts/ChecklistContext';
import { sortRegions } from '@/utils/regionOrder';
import {orderedNames} from '@/components/RegionTabs';

interface CheckItem {
  checkName: string;
  roomName: string;
  available: boolean;
  checked: boolean;
  roomIndex: number; // Which room (0, 1, 2, 3...)
  checkIndexInRoom: number; // Position within the room
}

export function useGamepadControls() {
  const { checklist, selectedRegion, setSelectedRegion, toggleCheck } = useChecklist();
  const [selectedCheckIndex, setSelectedCheckIndex] = useState(0);
  const [flatChecks, setFlatChecks] = useState<CheckItem[]>([]);
  const [selectedCheckName, setSelectedCheckName] = useState<string | null>(null);

  // Track previous button states and last action time for key repeat
  const prevButtonsRef = useRef<{ [key: number]: boolean }>({});
  const prevAxesRef = useRef<{ [key: number]: number }>({});
  const lastActionTimeRef = useRef<number>(0);
  const REPEAT_DELAY = 150; // milliseconds between repeats

  // Build flat list of checks from current region
  useEffect(() => {
    const checks: CheckItem[] = [];
    const currentRegionData = selectedRegion ? checklist[selectedRegion] : {};
    if (!currentRegionData) return;

    const rooms = Object.entries(currentRegionData).filter(([_, roomChecks]) =>
      Object.keys(roomChecks).length > 0
    );

    // Build flat list with room and position metadata
    rooms.forEach(([roomName, roomChecks], roomIndex) => {
      Object.entries(roomChecks).forEach(([checkName, checkData]: [string, any], checkIndexInRoom) => {
        checks.push({
          checkName,
          roomName,
          available: checkData.available,
          checked: checkData.checked,
          roomIndex,
          checkIndexInRoom,
        });
      });
    });

    setFlatChecks(checks);

    // Try to maintain selection by checkName
    if (selectedCheckName) {
      const newIndex = checks.findIndex(c => c.checkName === selectedCheckName);
      if (newIndex !== -1) {
        setSelectedCheckIndex(newIndex);
      } else {
        setSelectedCheckIndex(0);
        setSelectedCheckName(checks[0]?.checkName || null);
      }
    } else {
      setSelectedCheckIndex(0);
      setSelectedCheckName(checks[0]?.checkName || null);
    }
  }, [checklist, selectedRegion, selectedCheckName]);

  // Poll gamepad state using native API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animationFrameId: number;

    const pollGamepads = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

      // Find the first connected gamepad
      const gamepad = Array.from(gamepads).find(gp => gp !== null);

      if (!gamepad) {
        animationFrameId = requestAnimationFrame(pollGamepads);
        return;
      }

      const buttons = gamepad.buttons;
      const axes = gamepad.axes;
      const now = Date.now();
      const canRepeat = now - lastActionTimeRef.current >= REPEAT_DELAY;

      // Shoulder buttons for tab navigation (LB = button 4, RB = button 5)
      if (buttons[4]?.pressed && !prevButtonsRef.current[4]) {
        const regions = orderedNames;
        const currentIndex = regions.indexOf(selectedRegion);
        if (currentIndex > 0) {
          setSelectedRegion(regions[currentIndex - 1]);
        }
      }

      if (buttons[5]?.pressed && !prevButtonsRef.current[5]) {
        const regions = orderedNames;
        const currentIndex = regions.indexOf(selectedRegion);
        if (currentIndex < regions.length - 1) {
          setSelectedRegion(regions[currentIndex + 1]);
        }
      }

      // D-pad and analog stick for check navigation
      const dpadUp = buttons[12]?.pressed;
      const dpadDown = buttons[13]?.pressed;
      const dpadLeft = buttons[14]?.pressed;
      const dpadRight = buttons[15]?.pressed;
      const analogX = axes[0] || 0;
      const analogY = axes[1] || 0;

      const currentCheck = flatChecks[selectedCheckIndex];

      // Up navigation - stay in same column
      if ((dpadUp || analogY < -0.5) && canRepeat && currentCheck) {
        const currentRoomIndex = currentCheck.roomIndex;
        const isLeftColumn = currentRoomIndex % 2 === 0;

        // Find previous check in same column
        let newIndex = -1;
        for (let i = selectedCheckIndex - 1; i >= 0; i--) {
          const check = flatChecks[i];
          const checkIsLeftColumn = check.roomIndex % 2 === 0;
          if (checkIsLeftColumn === isLeftColumn) {
            newIndex = i;
            break;
          }
        }

        if (newIndex !== -1) {
          setSelectedCheckIndex(newIndex);
          setSelectedCheckName(flatChecks[newIndex]?.checkName || null);
          lastActionTimeRef.current = now;
        }
      }

      // Down navigation - stay in same column
      if ((dpadDown || analogY > 0.5) && canRepeat && currentCheck) {
        const currentRoomIndex = currentCheck.roomIndex;
        const isLeftColumn = currentRoomIndex % 2 === 0;

        // Find next check in same column
        let newIndex = -1;
        for (let i = selectedCheckIndex + 1; i < flatChecks.length; i++) {
          const check = flatChecks[i];
          const checkIsLeftColumn = check.roomIndex % 2 === 0;
          if (checkIsLeftColumn === isLeftColumn) {
            newIndex = i;
            break;
          }
        }

        if (newIndex !== -1) {
          setSelectedCheckIndex(newIndex);
          setSelectedCheckName(flatChecks[newIndex]?.checkName || null);
          lastActionTimeRef.current = now;
        }
      }

      // Left navigation - move to the room on the left (from odd to even room index)
      if ((dpadLeft || analogX < -0.5) && canRepeat && currentCheck) {
        const currentRoomIndex = currentCheck.roomIndex;
        const currentCheckInRoom = currentCheck.checkIndexInRoom;

        // Only move left if we're in a right column room (odd index)
        if (currentRoomIndex % 2 === 1) {
          const targetRoomIndex = currentRoomIndex - 1;
          // Find check in target room at same position or closest
          const targetChecks = flatChecks.filter(c => c.roomIndex === targetRoomIndex);
          if (targetChecks.length > 0) {
            const targetCheck = targetChecks[Math.min(currentCheckInRoom, targetChecks.length - 1)];
            const newIndex = flatChecks.findIndex(c => c.checkName === targetCheck.checkName);
            if (newIndex !== -1) {
              setSelectedCheckIndex(newIndex);
              setSelectedCheckName(targetCheck.checkName);
              lastActionTimeRef.current = now;
            }
          }
        }
      }

      // Right navigation - move to the room on the right (from even to odd room index)
      if ((dpadRight || analogX > 0.5) && canRepeat && currentCheck) {
        const currentRoomIndex = currentCheck.roomIndex;
        const currentCheckInRoom = currentCheck.checkIndexInRoom;

        // Only move right if we're in a left column room (even index)
        if (currentRoomIndex % 2 === 0) {
          const targetRoomIndex = currentRoomIndex + 1;
          // Find check in target room at same position or closest
          const targetChecks = flatChecks.filter(c => c.roomIndex === targetRoomIndex);
          if (targetChecks.length > 0) {
            const targetCheck = targetChecks[Math.min(currentCheckInRoom, targetChecks.length - 1)];
            const newIndex = flatChecks.findIndex(c => c.checkName === targetCheck.checkName);
            if (newIndex !== -1) {
              setSelectedCheckIndex(newIndex);
              setSelectedCheckName(targetCheck.checkName);
              lastActionTimeRef.current = now;
            }
          }
        }
      }

      // A button to toggle check (typically button 0)
      if (buttons[0]?.pressed && !prevButtonsRef.current[0]) {
        if (flatChecks[selectedCheckIndex]) {
          const checkToToggle = flatChecks[selectedCheckIndex].checkName;
          setSelectedCheckName(checkToToggle); // Remember this check
          toggleCheck(checkToToggle);
        }
      }

      // Store current button states
      prevButtonsRef.current = {};
      buttons.forEach((button, index) => {
        prevButtonsRef.current[index] = button.pressed;
      });

      // Store current axes values
      prevAxesRef.current = {};
      axes.forEach((value, index) => {
        prevAxesRef.current[index] = value;
      });

      animationFrameId = requestAnimationFrame(pollGamepads);
    };

    animationFrameId = requestAnimationFrame(pollGamepads);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [checklist, selectedRegion, selectedCheckIndex, flatChecks, toggleCheck, setSelectedRegion]);

  return {
    selectedCheckIndex,
    selectedCheck: flatChecks[selectedCheckIndex],
  };
}
