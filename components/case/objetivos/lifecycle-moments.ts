import type { L } from '@/lib/i18n'

export type Role = 'admin' | 'lider' | 'colaborador'

export interface Moment {
  id: string
  name: L
  roles: readonly Role[]
  /** Si la plataforma actual lo cubría. */
  before: boolean
  where: L
}

/** Los siete momentos de un ciclo de objetivos y quién los vive. */
export const MOMENTS: readonly Moment[] = [
  { id: 'configurar', name: { es: 'Configurar', en: 'Set up' }, roles: ['admin'], before: true, where: { es: 'Escala de cumplimiento, niveles de desempeño y permisos.', en: 'Attainment scale, performance levels and permissions.' } },
  { id: 'crear', name: { es: 'Crear', en: 'Create' }, roles: ['admin', 'lider', 'colaborador'], before: true, where: { es: 'Constructor de 5 pasos o carga masiva; RR. HH. o cada quien redacta.', en: '5-step builder or bulk upload; HR or each person writes.' } },
  { id: 'alinear', name: { es: 'Alinear', en: 'Align' }, roles: ['admin', 'lider'], before: false, where: { es: 'Cada objetivo cuelga de uno de empresa; lo demás queda «sin alinear».', en: 'Every goal hangs from a company goal; the rest is “unaligned”.' } },
  { id: 'aprobar', name: { es: 'Aprobar', en: 'Approve' }, roles: ['lider'], before: false, where: { es: 'El líder aprueba o devuelve con un motivo; sin aprobar no hay avance.', en: 'The lead approves or sends back with a reason; no approval, no progress.' } },
  { id: 'reportar', name: { es: 'Reportar', en: 'Report' }, roles: ['colaborador'], before: false, where: { es: 'Valor, comentario y evidencia; cada reporte queda en el historial.', en: 'Value, comment and evidence; every report stays in the history.' } },
  { id: 'leer', name: { es: 'Leer', en: 'Read' }, roles: ['admin', 'lider'], before: false, where: { es: 'Resumen, alineación, cumplimiento, ranking y lectura con IA.', en: 'Summary, alignment, attainment, ranking and AI reading.' } },
  { id: 'cerrar', name: { es: 'Cerrar', en: 'Close' }, roles: ['admin'], before: false, where: { es: 'Accionables que siguen al cierre: 360, matriz de talento y PDI.', en: 'Actions after close: 360, talent matrix and development plans.' } },
]

export const ROLE_NAME: Record<Role, L> = {
  admin: { es: 'Admin', en: 'Admin' },
  lider: { es: 'Líder', en: 'Lead' },
  colaborador: { es: 'Colaborador', en: 'Employee' },
}
