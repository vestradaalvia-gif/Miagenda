import { useState } from 'react';
import { CheckCircle2, ClipboardList, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import { formatFriendlyDate, getTodayISO } from '../data/initialData';
import { CourseTask } from '../types/agenda';

interface TareasViewProps {
  tasks: CourseTask[];
  onAddTask: () => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTaskStatus: (id: string) => void;
}

type TaskFilter = 'todas' | 'pendiente' | 'completada';

export function TareasView({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TareasViewProps) {
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const today = getTodayISO();

  const pendingCount = tasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  const filteredTasks = [...tasks]
    .filter((t) => (filter === 'todas' ? true : t.status === filter))
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pendiente' ? -1 : 1;
      }
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-5">
      {/* Cabecera y filtros */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Tareas del curso</h1>
            <p className="text-base text-slate-600 tabular-nums">
              {pendingCount} pendientes · {completedCount} completadas
            </p>
          </div>
          <button
            type="button"
            onClick={onAddTask}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span>Agregar tarea</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-flex">
          <button
            type="button"
            onClick={() => setFilter('todas')}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
              filter === 'todas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pendiente')}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
              filter === 'pendiente'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completada')}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
              filter === 'completada'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </section>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
          <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-slate-800">
              {filter === 'todas'
                ? 'Aún no tienes tareas registradas.'
                : filter === 'pendiente'
                  ? 'No tienes tareas pendientes.'
                  : 'Todavía no has completado ninguna tarea.'}
            </p>
            <p className="text-base text-slate-600">
              Agrega una nueva actividad práctica de Google AI Studio para dar seguimiento.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddTask}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Crear primera tarea</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completada';
            const isOverdue = !isCompleted && task.dueDate < today;

            return (
              <article
                key={task.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-slate-600">
                      Entrega:{' '}
                      <strong className={isOverdue ? 'text-red-700' : 'text-slate-900'}>
                        {formatFriendlyDate(task.dueDate)}
                      </strong>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 font-semibold ${
                        isCompleted ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 shrink-0" />
                      )}
                      <span>
                        {isCompleted
                          ? 'Completada'
                          : isOverdue
                            ? 'Pendiente (atrasada)'
                            : 'Pendiente'}
                      </span>
                    </span>
                  </div>

                  <h2
                    className={`font-display text-lg font-bold leading-snug ${
                      isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.name}
                  </h2>

                  <p className="text-base leading-relaxed text-slate-700">{task.description}</p>

                  <p className="text-sm text-slate-500">{task.module}</p>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                      isCompleted
                        ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{isCompleted ? 'Marcar pendiente' : 'Marcar completada'}</span>
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
    </div>
  );
}
