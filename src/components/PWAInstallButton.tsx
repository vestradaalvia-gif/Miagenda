import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>Instalar app</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
        >
          <Share className="h-4 w-4 shrink-0" />
          <span>Instalar</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
          >
            <div className="w-full max-w-[430px] rounded-t-3xl bg-white p-5 pb-8 shadow-xl space-y-4">
              <div className="flex justify-center pb-1">
                <div className="h-1.5 w-10 rounded-full bg-slate-300" aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between">
                <h2 id="ios-install-title" className="font-display text-lg font-bold text-slate-900">
                  Instalar en tu iPhone
                </h2>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                  aria-label="Cerrar instrucciones"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="space-y-2 text-base text-slate-700 leading-relaxed">
                <li>
                  1. Pulsa el botón <strong>Compartir</strong> en la barra inferior de Safari.
                </li>
                <li>
                  2. Desliza hacia abajo y selecciona <strong>Agregar a inicio</strong>.
                </li>
                <li>
                  3. Pulsa <strong>Agregar</strong> para abrir Mi Agenda como aplicación.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full min-h-[48px] rounded-2xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
