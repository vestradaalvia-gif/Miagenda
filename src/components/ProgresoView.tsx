import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { COURSE_MODULES, formatFriendlyDate } from '../data/initialData';
import { CourseTask, TabId } from '../types/agenda';

interface ProgresoViewProps {
  tasks: CourseTask[];
  classesCount: number;
  notesCount: number;
  onToggleTaskStatus: (id: string) => void;
  onNavigate: (tab: TabId) => void;
  onRequestResetDemo: () => void;
}

export function ProgresoView({
  tasks,
  classesCount,
  notesCount,
  onToggleTaskStatus,
  onNavigate,
  onRequestResetDemo,
}: ProgresoViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completada');
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente');
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);

  // SVG progress ring geometry
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const moduleBreakdown = COURSE_MODULES.map((mod) => {
    const modTasks = tasks.filter((t) => t.module === mod);
    const modDone = modTasks.filter((t) => t.status === 'completada').length;
    const modPct = modTasks.length === 0 ? 0 : Math.round((modDone / modTasks.length) * 100);
    return {
      module: mod,
      total: modTasks.length,
      done: modDone,
      pct: modPct,
    };
  });

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de progreso */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 124 124" aria-hidden="true">
                <circle
                  cx="62"
                  cy="62"
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                />
                <circle
                  cx="62"
                  cy="62"
                  r={radius}
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                  {percentage}%
                </span>
                <span className="text-xs font-medium text-slate-500">completado</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="font-display text-2xl font-bold text-slate-900">Tu progreso</h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Has completado{' '}
                <strong className="text-slate-900 tabular-nums">
                  {completedTasks.length} de {totalTasks}
                </strong>{' '}
                tareas del curso de Google AI Studio.
              </p>
              <p className="text-sm text-slate-500 tabular-nums">
                {classesCount} clases registradas · {notesCount} apuntes guardados
              </p>
            </div>
          </div>

          {/* 3 indicadores numéricos claros */}
          <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
              <p className="font-display text-2xl font-bold text-emerald-700 tabular-nums">
                {completedTasks.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700 sm:text-sm">Completadas</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
              <p className="font-display text-2xl font-bold text-amber-800 tabular-nums">
                {pendingTasks.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700 sm:text-sm">Pendientes</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
              <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                {totalTasks}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700 sm:text-sm">Total tareas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Avance por módulo */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">Avance por módulo</h2>
        <div className="space-y-4">
          {moduleBreakdown.map((item) => (
            <div key={item.module} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-slate-800">{item.module}</span>
                <span className="text-slate-600 tabular-nums">
                  {item.total === 0
                    ? 'Sin tareas asignadas'
                    : `${item.done} de ${item.total} completadas (${item.pct}%)`}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-700 transition-all duration-300"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Listas directas de pendientes y completadas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-700" />
              <span>Pendientes ({pendingTasks.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="min-h-[40px] rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Ir a Tareas
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="text-base text-slate-600">No quedan tareas pendientes.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-base font-semibold text-slate-900">{task.name}</p>
                    <p className="text-sm text-slate-600">
                      Entrega: {formatFriendlyDate(task.dueDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors whitespace-nowrap"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Completar</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            <span>Completadas ({completedTasks.length})</span>
          </h2>

          {completedTasks.length === 0 ? (
            <p className="text-base text-slate-600">Aún no has completado tareas.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {completedTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-base font-medium text-slate-700">{task.name}</p>
                    <p className="text-sm text-slate-500">
                      Entrega: {formatFriendlyDate(task.dueDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
                  >
                    Marcar pendiente
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Restablecer datos de ejemplo */}
      <section className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h2 className="font-display text-base font-bold text-slate-900">
            Datos de ejemplo del curso
          </h2>
          <p className="text-sm text-slate-600">
            Si editaste o borraste elementos, puedes restaurar los ejemplos iniciales de Google AI Studio.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestResetDemo}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restablecer ejemplos</span>
        </button>
      </section>
    </div>
  );
}
