import { AgendaData } from '../types/agenda';

export const COURSE_MODULES: string[] = [
  'Módulo 1: Fundamentos de AI Studio',
  'Módulo 2: Diseño de Prompts',
  'Módulo 3: Salidas Estructuradas',
  'Módulo 4: Herramientas y Grounding',
  'Módulo 5: Integración con SDK',
];

export function toLocalISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function offsetDaysISO(days: number, baseDate: Date = new Date()): string {
  const copy = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  copy.setDate(copy.getDate() + days);
  return toLocalISODate(copy);
}

export function getTodayISO(): string {
  return toLocalISODate(new Date());
}

const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const WEEKDAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export function formatFriendlyDate(iso: string): string {
  if (!iso) return '';
  const today = getTodayISO();
  const tomorrow = offsetDaysISO(1);
  const yesterday = offsetDaysISO(-1);

  const date = parseISODate(iso);
  const shortLabel = `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;

  if (iso === today) return `Hoy, ${shortLabel}`;
  if (iso === tomorrow) return `Mañana, ${shortLabel}`;
  if (iso === yesterday) return `Ayer, ${shortLabel}`;

  const weekday = WEEKDAYS_LONG[date.getDay()];
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalizedWeekday} ${shortLabel}`;
}

export function formatFullSpanishDate(iso: string): string {
  if (!iso) return '';
  const date = parseISODate(iso);
  const weekday = WEEKDAYS_LONG[date.getDay()];
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized}, ${date.getDate()} de ${MONTHS_LONG[date.getMonth()]} de ${date.getFullYear()}`;
}

export function getWeekdayShort(iso: string): string {
  const date = parseISODate(iso);
  return WEEKDAYS_SHORT[date.getDay()];
}

export function getDayNumber(iso: string): number {
  return parseISODate(iso).getDate();
}

export function getWeekDates(anchorISO: string): string[] {
  const date = parseISODate(anchorISO);
  // Start week on Monday (Lunes)
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffToMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    return toLocalISODate(d);
  });
}

export function formatWeekRange(weekDates: string[]): string {
  if (weekDates.length === 0) return '';
  const start = parseISODate(weekDates[0]);
  const end = parseISODate(weekDates[weekDates.length - 1]);
  const startMonth = MONTHS_SHORT[start.getMonth()];
  const endMonth = MONTHS_SHORT[end.getMonth()];
  if (startMonth === endMonth) {
    return `${start.getDate()} al ${end.getDate()} de ${MONTHS_LONG[end.getMonth()]}`;
  }
  return `${start.getDate()} ${startMonth} – ${end.getDate()} ${endMonth}`;
}

export function createInitialAgendaData(): AgendaData {
  return {
    classes: [
      {
        id: 'cls-1',
        title: 'Primeros pasos en Google AI Studio y selección de modelos Gemini',
        module: 'Módulo 1: Fundamentos de AI Studio',
        date: offsetDaysISO(0),
        startTime: '18:00',
        endTime: '19:30',
        instructor: 'Sofía Mendoza',
        modality: 'Clase en vivo',
      },
      {
        id: 'cls-2',
        title: 'Diseño de System Instructions y ejemplos Few-Shot',
        module: 'Módulo 2: Diseño de Prompts',
        date: offsetDaysISO(1),
        startTime: '10:00',
        endTime: '11:30',
        instructor: 'Carlos Vega',
        modality: 'Taller práctico',
      },
      {
        id: 'cls-3',
        title: 'Salidas estructuradas con JSON Schema en AI Studio',
        module: 'Módulo 3: Salidas Estructuradas',
        date: offsetDaysISO(3),
        startTime: '18:00',
        endTime: '19:30',
        instructor: 'Sofía Mendoza',
        modality: 'Clase en vivo',
      },
      {
        id: 'cls-4',
        title: 'Function Calling y Grounding con Búsqueda de Google',
        module: 'Módulo 4: Herramientas y Grounding',
        date: offsetDaysISO(5),
        startTime: '18:00',
        endTime: '19:30',
        instructor: 'Carlos Vega',
        modality: 'Laboratorio guiado',
      },
      {
        id: 'cls-5',
        title: 'Exportar código desde AI Studio e integrar @google/genai',
        module: 'Módulo 5: Integración con SDK',
        date: offsetDaysISO(7),
        startTime: '17:00',
        endTime: '18:30',
        instructor: 'Sofía Mendoza',
        modality: 'Proyecto final',
      },
    ],
    tasks: [
      {
        id: 'tsk-1',
        name: 'Crear primer prompt en modo Freeform',
        description:
          'Abrir Google AI Studio, elegir Gemini 2.5 Flash y guardar un prompt de resumen de artículos en Google Drive.',
        dueDate: offsetDaysISO(-1),
        status: 'completada',
        module: 'Módulo 1: Fundamentos de AI Studio',
      },
      {
        id: 'tsk-2',
        name: 'Comparar parámetros de Temperatura y Top-P',
        description:
          'Ejecutar el mismo prompt con temperatura 0.2 y 1.1 para analizar la diferencia entre precisión y creatividad.',
        dueDate: offsetDaysISO(0),
        status: 'pendiente',
        module: 'Módulo 1: Fundamentos de AI Studio',
      },
      {
        id: 'tsk-3',
        name: 'Probar análisis multimodal con diagramas e imágenes',
        description:
          'Subir una captura de pantalla de interfaz en AI Studio y solicitar una lista clara de mejoras de usabilidad.',
        dueDate: offsetDaysISO(-2),
        status: 'completada',
        module: 'Módulo 2: Diseño de Prompts',
      },
      {
        id: 'tsk-4',
        name: 'Redactar System Instructions para asistente de estudio',
        description:
          'Configurar el rol, tono pedagógico y límites del modelo usando el panel de instrucciones del sistema.',
        dueDate: offsetDaysISO(2),
        status: 'pendiente',
        module: 'Módulo 2: Diseño de Prompts',
      },
      {
        id: 'tsk-5',
        name: 'Definir esquema JSON para extraer datos de recibos',
        description:
          'Activar Structured Outputs en el panel derecho de AI Studio y verificar que devuelva fecha, monto y categoría.',
        dueDate: offsetDaysISO(4),
        status: 'pendiente',
        module: 'Módulo 3: Salidas Estructuradas',
      },
    ],
    notes: [
      {
        id: 'not-1',
        title: 'Cuándo ajustar la Temperatura y el límite de tokens',
        topic: 'Módulo 1: Fundamentos de AI Studio',
        content:
          'Usar temperatura baja (0.0 a 0.3) cuando necesito respuestas consistentes, clasificación o extracción de datos. Subir a 0.8 o más solo para lluvia de ideas. Revisar el contador de tokens en la barra superior para evitar cortes en respuestas largas.',
        updatedAt: offsetDaysISO(-1),
      },
      {
        id: 'not-2',
        title: 'Estructura recomendada para System Instructions',
        topic: 'Módulo 2: Diseño de Prompts',
        content:
          'Dividir las instrucciones en 4 bloques claros: 1) Rol del asistente, 2) Objetivo principal, 3) Formato de respuesta esperado y 4) Restricciones explícitas. Añadir 2 ejemplos cortos en la conversación mejora mucho la consistencia.',
        updatedAt: offsetDaysISO(0),
      },
      {
        id: 'not-3',
        title: 'Ventajas de Structured Outputs frente a pedir JSON en texto',
        topic: 'Módulo 3: Salidas Estructuradas',
        content:
          'Al definir el JSON Schema directamente en la configuración del modelo dentro de Google AI Studio, se evita que la respuesta incluya texto adicional o bloques markdown que rompen JSON.parse().',
        updatedAt: offsetDaysISO(0),
      },
      {
        id: 'not-4',
        title: 'Exportar con "Get code" al proyecto TypeScript',
        topic: 'Módulo 5: Integración con SDK',
        content:
          'El botón "Get code" genera el fragmento listo para usar con el paquete @google/genai. Recordar nunca guardar la API key en el código del navegador: usar siempre variables de entorno en el servidor.',
        updatedAt: offsetDaysISO(-2),
      },
    ],
  };
}
