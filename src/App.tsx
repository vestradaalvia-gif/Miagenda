import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Flag, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';

type Prioridad = 'baja' | 'media' | 'alta';

interface Actividad {
  id: number;
  titulo: string;
  fecha: string;
  prioridad: Prioridad;
  completada: boolean;
}

const PRIORIDAD_OPCIONES: {
  id: Prioridad;
  label: string;
  activeClass: string;
  listTextClass: string;
}[] = [
  {
    id: 'baja',
    label: 'Baja',
    activeClass: 'border-emerald-700 bg-emerald-50 text-emerald-900',
    listTextClass: 'text-emerald-700',
  },
  {
    id: 'media',
    label: 'Media',
    activeClass: 'border-amber-600 bg-amber-50 text-amber-900',
    listTextClass: 'text-amber-700',
  },
  {
    id: 'alta',
    label: 'Alta',
    activeClass: 'border-red-700 bg-red-50 text-red-900',
    listTextClass: 'text-red-700',
  },
];

type FiltroEstado = 'todas' | 'pendientes' | 'completadas';

const STORAGE_KEY = 'mi_agenda_movil_v1';

function getTodayLocalISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadStoredActivities(): Actividad[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const today = getTodayLocalISO();
      return parsed.map((item) => ({
        ...item,
        fecha: item.fecha && String(item.fecha).trim() ? String(item.fecha) : today,
        prioridad:
          item.prioridad === 'baja' || item.prioridad === 'media' || item.prioridad === 'alta'
            ? item.prioridad
            : 'media',
      }));
    }
  } catch {
    // Ignorar errores de almacenamiento local
  }
  return [];
}

function formatDisplayDate(isoDate: string): string {
  const target = isoDate || getTodayLocalISO();
  const parts = target.split('-');
  if (parts.length !== 3) return target;
  const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
  return target === getTodayLocalISO() ? `Hoy, ${formatted}` : formatted;
}

export default function App() {
  const [actividades, setActividades] = useState<Actividad[]>(loadStoredActivities);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas');

  // Hoja inferior (bottom sheet) para crear o editar una actividad
  const [sheetAbierto, setSheetAbierto] = useState(false);
  const [actividadEditando, setActividadEditando] = useState<Actividad | null>(null);
  const [formTitulo, setFormTitulo] = useState('');
  const [formFecha, setFormFecha] = useState('');
  const [formPrioridad, setFormPrioridad] = useState<Prioridad>('media');
  const [formError, setFormError] = useState('');
  const inputNombreRef = useRef<HTMLInputElement>(null);

  // Aviso con opción de deshacer al eliminar
  const [ultimaEliminada, setUltimaEliminada] = useState<Actividad | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(actividades));
    } catch {
      // Ignorar errores de cuota de almacenamiento
    }
  }, [actividades]);

  useEffect(() => {
    if (!ultimaEliminada) return;
    const timer = window.setTimeout(() => setUltimaEliminada(null), 4000);
    return () => window.clearTimeout(timer);
  }, [ultimaEliminada]);

  const abrirCrearActividad = () => {
    setActividadEditando(null);
    setFormTitulo('');
    setFormFecha('');
    setFormPrioridad('media');
    setFormError('');
    setSheetAbierto(true);
  };

  const abrirEditarActividad = (actividad: Actividad) => {
    setActividadEditando(actividad);
    setFormTitulo(actividad.titulo);
    setFormFecha(actividad.fecha);
    setFormPrioridad(actividad.prioridad);
    setFormError('');
    setSheetAbierto(true);
  };

  const cerrarSheet = () => {
    setSheetAbierto(false);
    setActividadEditando(null);
    setFormError('');
  };

  const handleGuardarFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    const tituloLimpio = formTitulo.trim();
    if (!tituloLimpio) {
      setFormError('Debes escribir una actividad.');
      inputNombreRef.current?.focus();
      return;
    }

    const fechaFinal = formFecha.trim() || getTodayLocalISO();

    if (actividadEditando) {
      setActividades((prev) =>
        prev.map((item) =>
          item.id === actividadEditando.id
            ? {
                ...item,
                titulo: tituloLimpio,
                fecha: fechaFinal,
                prioridad: formPrioridad,
              }
            : item
        )
      );
    } else {
      const nuevoId = Date.now();
      setActividades((prev) => [
        {
          id: nuevoId,
          titulo: tituloLimpio,
          fecha: fechaFinal,
          prioridad: formPrioridad,
          completada: false,
        },
        ...prev,
      ]);
    }
    cerrarSheet();
  };

  const handleToggleCompletada = (id: number) => {
    setActividades((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completada: !item.completada } : item
      )
    );
  };

  const handleEliminarActividad = (actividad: Actividad) => {
    setActividades((prev) => prev.filter((item) => item.id !== actividad.id));
    setUltimaEliminada(actividad);
  };

  const handleDeshacerEliminacion = () => {
    if (!ultimaEliminada) return;
    setActividades((prev) => [ultimaEliminada, ...prev]);
    setUltimaEliminada(null);
  };

  const totalCount = actividades.length;
  const completadasCount = actividades.filter((a) => a.completada).length;
  const pendientesCount = totalCount - completadasCount;
  const porcentajeCompletado =
    totalCount === 0 ? 0 : Math.round((completadasCount / totalCount) * 100);

  const busquedaLimpia = textoBusqueda.trim().toLowerCase();
  const actividadesFiltradas = actividades.filter((a) => {
    const coincideTexto = !busquedaLimpia || a.titulo.toLowerCase().includes(busquedaLimpia);
    const coincideEstado =
      filtroEstado === 'todas' ||
      (filtroEstado === 'pendientes' && !a.completada) ||
      (filtroEstado === 'completadas' && a.completada);
    return coincideTexto && coincideEstado;
  });

  return (
    <div className="min-h-[100dvh] bg-slate-200/70 sm:py-4">
      {/* Contenedor exclusivo para teléfono */}
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col bg-[#F6F8FB] text-slate-900 sm:min-h-[calc(100dvh-2rem)] sm:overflow-hidden sm:rounded-[30px] sm:border sm:border-slate-300 sm:shadow-md">
        {/* Barra superior móvil compacta (no fija para preservar espacio vertical) */}
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/icon.svg"
              alt="Icono de Mi Agenda"
              className="h-9 w-9 shrink-0 rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h1 className="font-display text-lg font-bold tracking-tight text-slate-900 truncate">
                Mi Agenda
              </h1>
              <p className="text-xs text-slate-500 tabular-nums">
                {totalCount === 0
                  ? 'Sin actividades'
                  : `${pendientesCount} pendientes · ${completadasCount} listas`}
              </p>
            </div>
          </div>

          <PWAInstallButton />
        </header>

        <OfflineIndicator />

        {/* Contenido desplazable */}
        <main className="flex-1 space-y-3.5 px-4 pt-4 pb-28">
          {/* Tarjeta compacta de resumen de progreso */}
          <section
            aria-label="Resumen de progreso"
            className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-700 tabular-nums">
                Progreso: {completadasCount} de {totalCount} completadas
              </span>
              <span className="font-display text-base font-bold text-blue-700 tabular-nums">
                {porcentajeCompletado}%
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Porcentaje de tareas completadas"
              aria-valuenow={porcentajeCompletado}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-blue-700 transition-all duration-200"
                style={{ width: `${porcentajeCompletado}%` }}
              />
            </div>
          </section>

          {/* Barra de búsqueda en tiempo real y filtros */}
          <section className="space-y-2.5" aria-label="Búsqueda y filtros">
            <div className="relative">
              <label htmlFor="barra-busqueda-movil" className="sr-only">
                Buscar actividad por nombre
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="barra-busqueda-movil"
                type="search"
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                placeholder="Buscar actividad por nombre..."
                className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white pl-10 pr-11 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
              {textoBusqueda && (
                <button
                  type="button"
                  onClick={() => setTextoBusqueda('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex min-h-[42px] min-w-[42px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => setFiltroEstado('todas')}
                className={`min-h-[40px] rounded-lg px-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  filtroEstado === 'todas'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Todas ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFiltroEstado('pendientes')}
                className={`min-h-[40px] rounded-lg px-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  filtroEstado === 'pendientes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Pendientes ({pendientesCount})
              </button>
              <button
                type="button"
                onClick={() => setFiltroEstado('completadas')}
                className={`min-h-[40px] rounded-lg px-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  filtroEstado === 'completadas'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Listas ({completadasCount})
              </button>
            </div>
          </section>

          {/* Lista de actividades */}
          <section aria-label="Lista de actividades">
            {actividadesFiltradas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center space-y-3">
                <p className="text-base font-semibold text-slate-800">
                  {totalCount === 0
                    ? 'Tu agenda está vacía'
                    : 'No hay actividades que coincidan'}
                </p>
                <p className="text-sm text-slate-600">
                  {totalCount === 0
                    ? 'Toca el botón inferior para agregar tu primera actividad.'
                    : 'Cambia el filtro o limpia el texto del buscador.'}
                </p>
                {totalCount === 0 && (
                  <button
                    type="button"
                    onClick={abrirCrearActividad}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Agregar primera actividad</span>
                  </button>
                )}
              </div>
            ) : (
              <ul className="space-y-2.5">
                {actividadesFiltradas.map((actividad) => (
                  <li
                    key={actividad.id}
                    className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2 py-2.5"
                  >
                    <label className="flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-xl active:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={actividad.completada}
                        onChange={() => handleToggleCompletada(actividad.id)}
                        aria-label={`Marcar "${actividad.titulo}" como completada`}
                        className="h-5 w-5 rounded border-slate-400 accent-blue-700 cursor-pointer"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleToggleCompletada(actividad.id)}
                      className="min-w-0 flex-1 py-1 text-left"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span
                          className={`text-base leading-snug break-words ${
                            actividad.completada
                              ? 'text-slate-400 line-through'
                              : 'text-slate-900 font-medium'
                          }`}
                        >
                          {actividad.titulo}
                        </span>
                        <span className="text-xs font-medium text-blue-700 tabular-nums shrink-0">
                          · {formatDisplayDate(actividad.fecha)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            PRIORIDAD_OPCIONES.find((p) => p.id === actividad.prioridad)
                              ?.listTextClass ?? 'text-amber-700'
                          }`}
                        >
                          <Flag className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span>
                            Prioridad{' '}
                            {PRIORIDAD_OPCIONES.find((p) => p.id === actividad.prioridad)?.label ??
                              'Media'}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span className="text-slate-500">
                          {actividad.completada ? 'Completada' : 'Pendiente'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => abrirEditarActividad(actividad)}
                      aria-label={`Editar "${actividad.titulo}"`}
                      className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-blue-700 active:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEliminarActividad(actividad)}
                      aria-label={`Eliminar "${actividad.titulo}"`}
                      className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-red-700 active:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        {/* Aviso con opción de deshacer */}
        {ultimaEliminada && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-22 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg"
          >
            <span className="truncate">Actividad eliminada</span>
            <button
              type="button"
              onClick={handleDeshacerEliminacion}
              className="min-h-[36px] shrink-0 rounded-lg px-2.5 font-semibold text-blue-300 hover:text-blue-200"
            >
              Deshacer
            </button>
          </div>
        )}

        {/* Barra de acción fija en zona natural del pulgar (<15% de la pantalla móvil) */}
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-t from-[#F6F8FB] via-[#F6F8FB]/95 to-transparent px-4 pt-3 pb-4 pb-safe">
          <button
            type="button"
            onClick={abrirCrearActividad}
            className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-base font-semibold text-white shadow-md shadow-blue-900/15 active:scale-[0.98] transition-transform"
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span>Agregar actividad</span>
          </button>
        </div>

        {/* Bottom Sheet móvil para agregar o editar actividad */}
        {sheetAbierto && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-actividad-titulo"
            onClick={(e) => {
              if (e.target === e.currentTarget) cerrarSheet();
            }}
          >
            <div className="w-full max-w-[430px] rounded-t-3xl bg-white p-5 pb-7 shadow-xl space-y-4">
              <div className="flex justify-center pb-1">
                <div className="h-1.5 w-10 rounded-full bg-slate-300" aria-hidden="true" />
              </div>

              <div className="flex items-center justify-between">
                <h2
                  id="sheet-actividad-titulo"
                  className="font-display text-lg font-bold text-slate-900"
                >
                  {actividadEditando ? 'Editar actividad' : 'Nueva actividad'}
                </h2>
                <button
                  type="button"
                  onClick={cerrarSheet}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                  aria-label="Cerrar formulario"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleGuardarFormulario} className="space-y-4">
                <div>
                  <label
                    htmlFor="sheet-nombre-actividad"
                    className="mb-1.5 block text-sm font-semibold text-slate-800"
                  >
                    Nombre de la actividad
                  </label>
                  <input
                    ref={inputNombreRef}
                    id="sheet-nombre-actividad"
                    type="text"
                    autoFocus
                    value={formTitulo}
                    aria-invalid={Boolean(formError) || (formTitulo.length > 0 && formTitulo.trim().length === 0)}
                    aria-describedby={
                      formError || (formTitulo.length > 0 && formTitulo.trim().length === 0)
                        ? 'sheet-nombre-error'
                        : undefined
                    }
                    onChange={(e) => {
                      const valor = e.target.value;
                      setFormTitulo(valor);
                      if (valor.length > 0 && valor.trim().length === 0) {
                        setFormError('Debes escribir una actividad.');
                      } else if (formError) {
                        setFormError('');
                      }
                    }}
                    placeholder="Ej. Comprar cuaderno o estudiar tema 2"
                    className={`w-full min-h-[48px] rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      formError
                        ? 'border-red-600 focus:border-red-700 focus:ring-red-600/20'
                        : 'border-slate-300 focus:border-blue-700 focus:ring-blue-700/20'
                    }`}
                  />
                  {formError && (
                    <p
                      id="sheet-nombre-error"
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="sheet-fecha-actividad"
                    className="mb-1.5 block text-sm font-semibold text-slate-800"
                  >
                    Fecha
                  </label>
                  <input
                    id="sheet-fecha-actividad"
                    type="date"
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Si no eliges una fecha, se usará la de hoy.
                  </p>
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Prioridad
                  </span>
                  <div className="grid grid-cols-3 gap-2" role="group" aria-label="Prioridad">
                    {PRIORIDAD_OPCIONES.map((opcion) => {
                      const seleccionada = formPrioridad === opcion.id;
                      return (
                        <button
                          key={opcion.id}
                          type="button"
                          onClick={() => setFormPrioridad(opcion.id)}
                          aria-pressed={seleccionada}
                          className={`min-h-[46px] rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                            seleccionada
                              ? opcion.activeClass
                              : 'border-slate-300 bg-white text-slate-700 active:bg-slate-50'
                          }`}
                        >
                          {opcion.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={cerrarSheet}
                    className="min-h-[48px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 active:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="min-h-[48px] rounded-2xl bg-blue-700 px-4 py-3 text-base font-semibold text-white active:bg-blue-800"
                  >
                    {actividadEditando ? 'Guardar' : 'Agregar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
