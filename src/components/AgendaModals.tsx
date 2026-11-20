import React, { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { COURSE_MODULES, getTodayISO } from '../data/initialData';
import { CourseClass, CourseNote, CourseTask, TaskStatus } from '../types/agenda';

interface SheetWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function SheetWrapper({ title, onClose, children }: SheetWrapperProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-sheet-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <h2 id="modal-sheet-title" className="font-display text-lg font-bold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

interface ClassFormModalProps {
  initialValue?: CourseClass | null;
  defaultDate?: string;
  onSave: (data: Omit<CourseClass, 'id'>) => void;
  onClose: () => void;
}

export function ClassFormModal({
  initialValue,
  defaultDate,
  onSave,
  onClose,
}: ClassFormModalProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [module, setModule] = useState(initialValue?.module ?? COURSE_MODULES[0]);
  const [date, setDate] = useState(initialValue?.date ?? defaultDate ?? getTodayISO());
  const [startTime, setStartTime] = useState(initialValue?.startTime ?? '18:00');
  const [endTime, setEndTime] = useState(initialValue?.endTime ?? '19:30');
  const [instructor, setInstructor] = useState(initialValue?.instructor ?? 'Sofía Mendoza');
  const [modality, setModality] = useState(initialValue?.modality ?? 'Clase en vivo');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe el nombre de la clase.');
      return;
    }
    if (!date) {
      setError('Selecciona una fecha para la clase.');
      return;
    }
    onSave({
      title: title.trim(),
      module,
      date,
      startTime: startTime || '18:00',
      endTime: endTime || '19:30',
      instructor: instructor.trim() || 'Por confirmar',
      modality: modality.trim() || 'Clase en vivo',
    });
  };

  return (
    <SheetWrapper title={initialValue ? 'Editar clase' : 'Nueva clase'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="class-title" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Título de la clase
          </label>
          <input
            id="class-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Práctica con Function Calling"
            className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div>
          <label htmlFor="class-module" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Módulo del curso
          </label>
          <select
            id="class-module"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            {COURSE_MODULES.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="class-date" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Fecha
            </label>
            <input
              id="class-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <div>
            <label htmlFor="class-start" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Hora inicio
            </label>
            <input
              id="class-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <div>
            <label htmlFor="class-end" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Hora fin
            </label>
            <input
              id="class-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="class-instructor" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Docente
            </label>
            <input
              id="class-instructor"
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="Ej. Sofía Mendoza"
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <div>
            <label htmlFor="class-modality" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Modalidad
            </label>
            <select
              id="class-modality"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Clase en vivo">Clase en vivo</option>
              <option value="Taller práctico">Taller práctico</option>
              <option value="Laboratorio guiado">Laboratorio guiado</option>
              <option value="Clase grabada">Clase grabada</option>
              <option value="Proyecto final">Proyecto final</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[48px] rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            {initialValue ? 'Guardar cambios' : 'Guardar clase'}
          </button>
        </div>
      </form>
    </SheetWrapper>
  );
}

interface TaskFormModalProps {
  initialValue?: CourseTask | null;
  defaultDate?: string;
  onSave: (data: Omit<CourseTask, 'id'>) => void;
  onClose: () => void;
}

export function TaskFormModal({
  initialValue,
  defaultDate,
  onSave,
  onClose,
}: TaskFormModalProps) {
  const [name, setName] = useState(initialValue?.name ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [dueDate, setDueDate] = useState(initialValue?.dueDate ?? defaultDate ?? getTodayISO());
  const [status, setStatus] = useState<TaskStatus>(initialValue?.status ?? 'pendiente');
  const [module, setModule] = useState(initialValue?.module ?? COURSE_MODULES[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Escribe el nombre de la tarea.');
      return;
    }
    if (!dueDate) {
      setError('Selecciona una fecha de entrega.');
      return;
    }
    onSave({
      name: name.trim(),
      description: description.trim() || 'Sin descripción adicional.',
      dueDate,
      status,
      module,
    });
  };

  return (
    <SheetWrapper title={initialValue ? 'Editar tarea' : 'Nueva tarea'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="task-name" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Nombre de la tarea
          </label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Probar instrucciones del sistema en AI Studio"
            className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div>
          <label htmlFor="task-desc" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Descripción
          </label>
          <textarea
            id="task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe qué debes practicar o entregar..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="task-date" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Fecha de entrega
            </label>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <div>
            <label htmlFor="task-module" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Tema o módulo
            </label>
            <select
              id="task-module"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              {COURSE_MODULES.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-slate-800">Estado</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setStatus('pendiente')}
              className={`min-h-[46px] rounded-xl border px-4 py-2.5 text-base font-semibold transition-colors ${
                status === 'pendiente'
                  ? 'border-amber-600 bg-amber-50 text-amber-900'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Pendiente
            </button>
            <button
              type="button"
              onClick={() => setStatus('completada')}
              className={`min-h-[46px] rounded-xl border px-4 py-2.5 text-base font-semibold transition-colors ${
                status === 'completada'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Completada
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[48px] rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            {initialValue ? 'Guardar cambios' : 'Guardar tarea'}
          </button>
        </div>
      </form>
    </SheetWrapper>
  );
}

interface NoteFormModalProps {
  initialValue?: CourseNote | null;
  onSave: (data: Omit<CourseNote, 'id' | 'updatedAt'>) => void;
  onClose: () => void;
}

export function NoteFormModal({ initialValue, onSave, onClose }: NoteFormModalProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [topic, setTopic] = useState(initialValue?.topic ?? COURSE_MODULES[0]);
  const [content, setContent] = useState(initialValue?.content ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para el apunte.');
      return;
    }
    if (!content.trim()) {
      setError('Escribe el contenido de tu apunte.');
      return;
    }
    onSave({
      title: title.trim(),
      topic,
      content: content.trim(),
    });
  };

  return (
    <SheetWrapper title={initialValue ? 'Editar apunte' : 'Nuevo apunte'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="note-title" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Título del apunte
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Consejos para escribir buenos prompts"
            className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div>
          <label htmlFor="note-topic" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Tema del curso
          </label>
          <select
            id="note-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            {COURSE_MODULES.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note-content" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Contenido del apunte
          </label>
          <textarea
            id="note-content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Anota ideas clave, ejemplos de prompts o pasos aprendidos en clase..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base leading-relaxed text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[48px] rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            {initialValue ? 'Guardar cambios' : 'Guardar apunte'}
          </button>
        </div>
      </form>
    </SheetWrapper>
  );
}

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <SheetWrapper title={title} onClose={onClose}>
      <div className="space-y-5">
        <p className="text-base leading-relaxed text-slate-700">{message}</p>
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-base font-semibold text-white hover:bg-red-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </SheetWrapper>
  );
}
