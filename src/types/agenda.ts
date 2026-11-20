export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pendiente' | 'completada';

export interface CourseClass {
  id: string;
  title: string;
  module: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  instructor: string;
  modality: string;
}

export interface CourseTask {
  id: string;
  name: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  module: string;
}

export interface CourseNote {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}

export interface AgendaData {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
}
