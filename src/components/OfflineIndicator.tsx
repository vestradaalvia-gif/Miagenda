import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-sm font-medium text-amber-900"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-amber-700" />
      <span>Modo sin conexión · Tus tareas siguen guardadas en el teléfono.</span>
    </div>
  );
};
