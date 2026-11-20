import { useState } from 'react';
import {
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  formatFriendlyDate,
  formatFullSpanishDate,
  formatWeekRange,
  getDayNumber,
  getTodayISO,
  getWeekDates,
  getWeekdayShort,
  offsetDaysISO,
  parseISODate,
} from '../data/initialData';
import { CourseClass, CourseTask } from '../types/agenda';

interface CalendarioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onAddClass: (defaultDate?: string) => void;
  onEditClass: (item: CourseClass) => void;
  onDeleteClass: (item: CourseClass) => void;
  onAddTask: (defaultDate?: string) => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTaskStatus: (id: string) => void;
}

export function CalendarioView({
  classes,
  tasks,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: CalendarioViewProps) {
  const today = getTodayISO();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');

  const weekDates = getWeekDates(selectedDate);
  const weekRangeLabel = formatWeekRange(weekDates);

  const goPreviousWeek = () => {
    setSelectedDate(offsetDaysISO(-7, parseISODate(selectedDate)));
  };

  const goNextWeek = () => {
    setSelectedDate(offsetDaysISO(7, parseISODate(selectedDate)));
  };

  const goToday = () => {
    setSelectedDate(today);
  };

  const getItemsForDate = (dateISO: string) => {
    const dayClasses = classes
      .filter((c) => c.date === dateISO)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    const dayTasks = tasks.filter((t) => t.dueDate === dateISO);
    return { dayClasses, dayTasks };
  };

  const selectedDayData = getItemsForDate(selectedDate);

  return (
    <div className="space-y-5">
      {/* Cabecera de sección */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Calendario</h1>
            <p className="text-base text-slate-600">
              Consulta tus clases y fechas de entrega por día o por semana.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:flex">
            <button
              type="button"
              onClick={() => onAddClass(selectedDate)}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-base font-semibold text-white hover:bg-blue-800 transition-colors whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span>Nueva clase</span>
            </button>
            <button
              type="button"
              onClick={() => onAddTask(selectedDate)}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0 text-blue-700" />
              <span>Nueva tarea</span>
            </button>
          </div>
        </div>

        {/* Selector de modo Día / Semana y navegación semanal */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-flex">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'dia'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Actividades por día
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'semana'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resumen semanal
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goPreviousWeek}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-center">
              <span className="text-sm font-semibold text-slate-800 capitalize sm:text-base">
                {weekRangeLabel}
              </span>
              {selectedDate !== today && (
                <button
                  type="button"
                  onClick={goToday}
                  className="min-h-[36px] rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors whitespace-nowrap"
                >
                  Ir a hoy
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={goNextWeek}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tira de 7 días para selección táctil rápida */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDates.map((dateISO) => {
            const { dayClasses, dayTasks } = getItemsForDate(dateISO);
            const totalCount = dayClasses.length + dayTasks.length;
            const isSelected = dateISO === selectedDate;
            const isToday = dateISO === today;

            return (
              <button
                key={dateISO}
                type="button"
                onClick={() => {
                  setSelectedDate(dateISO);
                  setViewMode('dia');
                }}
                className={`flex min-h-[68px] flex-col items-center justify-center rounded-xl border px-1 py-2 transition-colors ${
                  isSelected
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : isToday
                      ? 'border-blue-300 bg-blue-50 text-blue-950 hover:bg-blue-100'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {getWeekdayShort(dateISO)}
                </span>
                <span className="mt-0.5 text-lg font-bold tabular-nums leading-none">
                  {getDayNumber(dateISO)}
                </span>
                <span
                  className={`mt-1 text-[11px] font-semibold tabular-nums leading-none ${
                    totalCount === 0
                      ? 'opacity-0'
                      : isSelected
                        ? 'text-blue-100'
                        : 'text-blue-700'
                  }`}
                >
                  {totalCount > 0 ? `${totalCount} act.` : '0'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Vista por día */}
      {viewMode === 'dia' ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-slate-900">
              {formatFullSpanishDate(selectedDate)}
            </h2>
            <span className="text-sm font-medium text-slate-600 tabular-nums">
              {selectedDayData.dayClasses.length} clases
              <span aria-hidden="true" className="mx-2 text-slate-300">·</span>
              {selectedDayData.dayTasks.length} entregas
            </span>
          </div>

          {selectedDayData.dayClasses.length === 0 && selectedDayData.dayTasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-4">
              <CalendarIcon className="mx-auto h-8 w-8 text-slate-400" />
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-800">
                  No hay clases ni entregas para este día.
                </p>
                <p className="text-sm text-slate-600">
                  Usa los botones para programar una clase o una fecha de entrega.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onAddClass(selectedDate)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Agregar clase este día</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddTask(selectedDate)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-700" />
                  <span>Agregar tarea este día</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {selectedDayData.dayClasses.map((cls) => (
                <article
                  key={cls.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3"
                >
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-blue-700 tabular-nums">
                      Clase · {cls.startTime} – {cls.endTime} · {cls.modality}
                    </p>
                    <h3 className="font-display text-lg font-bold text-slate-900">{cls.title}</h3>
                    <p className="text-sm text-slate-600">
                      {cls.module} · Docente: {cls.instructor}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onEditClass(cls)}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Editar clase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(cls)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}

              {selectedDayData.dayTasks.map((task) => {
                const isDone = task.status === 'completada';
                return (
                  <article
                    key={task.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-slate-700">Entrega de tarea</span>
                        <span
                          className={`inline-flex items-center gap-1.5 font-semibold ${
                            isDone ? 'text-emerald-700' : 'text-amber-800'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                          <span>{isDone ? 'Completada' : 'Pendiente'}</span>
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900">{task.name}</h3>
                      <p className="text-base text-slate-600">{task.description}</p>
                      <p className="text-sm text-slate-500">{task.module}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                          isDone
                            ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isDone ? 'Marcar pendiente' : 'Marcar completada'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* Vista semanal */
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Actividades de la semana ({weekRangeLabel})
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {weekDates.map((dateISO) => {
              const { dayClasses, dayTasks } = getItemsForDate(dateISO);
              const isToday = dateISO === today;
              const hasItems = dayClasses.length > 0 || dayTasks.length > 0;

              return (
                <article
                  key={dateISO}
                  className={`rounded-2xl border bg-white p-4 space-y-3 ${
                    isToday ? 'border-blue-400' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {formatFriendlyDate(dateISO)}
                      </h3>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {dayClasses.length} clases · {dayTasks.length} entregas
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(dateISO);
                        setViewMode('dia');
                      }}
                      className="min-h-[40px] rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      Abrir día
                    </button>
                  </div>

                  {!hasItems ? (
                    <p className="py-2 text-sm text-slate-500">Sin actividades programadas.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {dayClasses.map((cls) => (
                        <li
                          key={cls.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                        >
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-blue-700 tabular-nums">
                              <BookOpen className="mr-1 inline h-3.5 w-3.5" />
                              Clase · {cls.startTime} – {cls.endTime}
                            </p>
                            <p className="text-sm font-semibold text-slate-900">{cls.title}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onEditClass(cls)}
                            className="min-h-[40px] shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                          >
                            Editar
                          </button>
                        </li>
                      ))}
                      {dayTasks.map((task) => {
                        const isDone = task.status === 'completada';
                        return (
                          <li
                            key={task.id}
                            className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                          >
                            <div className="space-y-0.5">
                              <p
                                className={`text-xs font-semibold ${
                                  isDone ? 'text-emerald-700' : 'text-amber-800'
                                }`}
                              >
                                {isDone ? 'Tarea completada' : 'Entrega pendiente'}
                              </p>
                              <p className="text-sm font-semibold text-slate-900">{task.name}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onToggleTaskStatus(task.id)}
                              className="min-h-[40px] shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                            >
                              {isDone ? 'Reabrir' : 'Completar'}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
