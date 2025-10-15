'use client';

import { useGamepadControls } from '@/hooks/useGamepadControls';
import { ReactNode } from 'react';

interface GamepadWrapperProps {
  children: (selectedCheckName?: string) => ReactNode;
}

export function GamepadWrapper({ children }: GamepadWrapperProps) {
  const { selectedCheck } = useGamepadControls();

  return <>{children(selectedCheck?.checkName)}</>;
}
