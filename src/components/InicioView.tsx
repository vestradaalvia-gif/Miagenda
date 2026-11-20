import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { formatFriendlyDate, getTodayISO } from '../data/initialData';
import { CourseClass, CourseTask, TabId } from '../types/agenda';

interface InicioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  notesCount: number;
  onNavigate: (tab: TabId) => void;
  onAddClass: () => void;
  onEditClass: (item: CourseClass) => void;
  onDeleteClass: (item: CourseClass) => void;
  onAddTask: () => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTaskStatus: (id: string) => void;
  onAddNote: () => void;
}

export function InicioView({
  classes,
  tasks,
  notesCount,
  onNavigate,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
  onAddNote,
}: InicioViewProps) {
  const today = getTodayISO();

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today)
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
    .slice(0, 3);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  return (
    <div className="space-y-6">
      {/* Encabezado de resumen y accesos rápidos */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-blue-700">Curso de Google AI Studio</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              Resumen de tu aprendizaje
            </h1>
            <p className="text-base text-slate-600 tabular-nums">
              <span>{upcomingClasses.length} próximas clases</span>
              <span aria-hidden="true" className="mx-2 text-slate-400">·</span>
              <span>{pendingTasks.length} tareas pendientes</span>
              <span aria-hidden="true" className="mx-2 text-slate-400">·</span>
              <span>{completedCount} completadas</span>
              <span aria-hidden="true" className="mx-2 text-slate-400">·</span>
              <span>{notesCount} apuntes</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:flex lg:flex-wrap">
            <button
              type="button"
              onClick={onAddTask}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white hover:bg-blue-800 active:scale-[0.99] transition-all whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span>Nueva tarea</span>
            </button>
            <button
              type="button"
              onClick={onAddClass}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 active:scale-[0.99] transition-all whitespace-nowrap"
            >
              <Calendar className="h-5 w-5 shrink-0 text-blue-700" />
              <span>Nueva clase</span>
            </button>
            <button
              type="button"
              onClick={onAddNote}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 active:scale-[0.99] transition-all whitespace-nowrap"
            >
              <FileText className="h-5 w-5 shrink-0 text-blue-700" />
              <span>Nuevo apunte</span>
            </button>
          </div>
        </div>
      </section>

      {/* Columnas principales: Próximas clases y Tareas pendientes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Próximas clases */}
        <section className="space-y-4 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-slate-900">Próximas clases</h2>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ver calendario</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-3">
              <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
              <p className="text-base font-medium text-slate-700">
                No tienes próximas clases programadas.
              </p>
              <button
                type="button"
                onClick={onAddClass}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar clase</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3"
                >
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-slate-600 tabular-nums">
                      <span className="font-semibold text-blue-700">
                        {formatFriendlyDate(item.date)}
                      </span>
                      <span aria-hidden="true" className="mx-2 text-slate-300">·</span>
                      <span>
                        {item.startTime} – {item.endTime}
                      </span>
                      <span aria-hidden="true" className="mx-2 text-slate-300">·</span>
                      <span>{item.modality}</span>
                    </p>
                    <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {item.module}
                      <span aria-hidden="true" className="mx-2 text-slate-300">·</span>
                      <span>Docente: {item.instructor}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onEditClass(item)}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="h-4 w-4 shrink-0" />
                      <span>Editar clase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(item)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 shrink-0" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Tareas pendientes */}
        <section className="space-y-4 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-slate-900">Tareas pendientes</h2>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-3">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-700" />
              <p className="text-base font-medium text-slate-800">
                ¡Al día! No tienes tareas pendientes en este momento.
              </p>
              <button
                type="button"
                onClick={onAddTask}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Agregar nueva tarea</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((task) => {
                const isOverdue = task.dueDate < today;
                return (
                  <article
                    key={task.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="text-slate-600">
                          Entrega:{' '}
                          <strong className={isOverdue ? 'text-red-700' : 'text-slate-900'}>
                            {formatFriendlyDate(task.dueDate)}
                          </strong>
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>{isOverdue ? 'Pendiente (atrasada)' : 'Pendiente'}</span>
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                        {task.name}
                      </h3>
                      <p className="text-base text-slate-600 leading-relaxed">{task.description}</p>
                      <p className="text-sm text-slate-500">{task.module}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors whitespace-nowrap"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Marcar completada</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <Pencil className="h-4 w-4 shrink-0" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 shrink-0" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
