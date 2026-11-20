import { useEffect, useState } from 'react';
import { createInitialAgendaData, getTodayISO } from '../data/initialData';
import { AgendaData, CourseClass, CourseNote, CourseTask } from '../types/agenda';

const STORAGE_KEY = 'mi_agenda_aprendizaje_v1';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadInitialState(): AgendaData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AgendaData>;
      if (
        Array.isArray(parsed.classes) &&
        Array.isArray(parsed.tasks) &&
        Array.isArray(parsed.notes)
      ) {
        return {
          classes: parsed.classes,
          tasks: parsed.tasks,
          notes: parsed.notes,
        };
      }
    }
  } catch {
    // Ignore storage read errors and fall back to sample data
  }
  return createInitialAgendaData();
}

export function useAgendaStore() {
  const [data, setData] = useState<AgendaData>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage quota errors
    }
  }, [data]);

  // Classes CRUD
  const addClass = (input: Omit<CourseClass, 'id'>) => {
    const newItem: CourseClass = { ...input, id: generateId('cls') };
    setData((prev) => ({
      ...prev,
      classes: [...prev.classes, newItem],
    }));
  };

  const updateClass = (id: string, input: Omit<CourseClass, 'id'>) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.map((item) => (item.id === id ? { ...input, id } : item)),
    }));
  };

  const deleteClass = (id: string) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.filter((item) => item.id !== id),
    }));
  };

  // Tasks CRUD
  const addTask = (input: Omit<CourseTask, 'id'>) => {
    const newItem: CourseTask = { ...input, id: generateId('tsk') };
    setData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newItem],
    }));
  };

  const updateTask = (id: string, input: Omit<CourseTask, 'id'>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((item) => (item.id === id ? { ...input, id } : item)),
    }));
  };

  const toggleTaskStatus = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'completada' ? 'pendiente' : 'completada' }
          : item
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((item) => item.id !== id),
    }));
  };

  // Notes CRUD
  const addNote = (input: Omit<CourseNote, 'id' | 'updatedAt'>) => {
    const newItem: CourseNote = {
      ...input,
      id: generateId('not'),
      updatedAt: getTodayISO(),
    };
    setData((prev) => ({
      ...prev,
      notes: [newItem, ...prev.notes],
    }));
  };

  const updateNote = (id: string, input: Omit<CourseNote, 'id' | 'updatedAt'>) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((item) =>
        item.id === id ? { ...input, id, updatedAt: getTodayISO() } : item
      ),
    }));
  };

  const deleteNote = (id: string) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((item) => item.id !== id),
    }));
  };

  const resetDemoData = () => {
    setData(createInitialAgendaData());
  };

  return {
    classes: data.classes,
    tasks: data.tasks,
    notes: data.notes,
    addClass,
    updateClass,
    deleteClass,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    addNote,
    updateNote,
    deleteNote,
    resetDemoData,
  };
}
