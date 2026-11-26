import type { L } from '@/lib/i18n'
import type { CaseImage, ChapterIntro, Decision } from './types'

const IMG = '/cases/barberlytics'
const shot = (name: string, width: number, height: number, alt: L, caption?: L): CaseImage => ({
  src: `${IMG}/${name}.webp`,
  width,
  height,
  alt,
  caption,
})

export const PLATFORM = {
  title: { es: 'Calendario · el negocio por dentro', en: 'Calendar · the business inside' },
  intro: {
    kicker: { es: '¿Qué ve cada persona de la barbería?', en: 'What does each person in the shop see?' },
    lead: {
      es: 'La primera versión fue una app móvil. Al rediseñarla investigué módulo por módulo —diecisiete informes con la misma plantilla y veintisiete productos comparados— y encontré el patrón que lo atravesaba todo: «la pantalla está bien, el cable no». Módulos bien hechos, pero desconectados.',
      en: 'The first version was a mobile app. To redesign it I researched module by module —seventeen reports on one template and twenty-seven products compared— and found the pattern underneath everything: “the screen is fine, the wiring isn’t”. Well-made modules, but disconnected.',
    },
    stats: [
      { value: '17', label: { es: 'investigaciones por módulo', en: 'module research reports' } },
      { value: '27', label: { es: 'productos comparados', en: 'products compared' } },
      { value: '5', label: { es: 'roles', en: 'roles' } },
      { value: '692', label: { es: 'acciones mapeadas por rol', en: 'actions mapped by role' } },
    ],
  } satisfies ChapterIntro,
  before: {
    title: { es: 'Antes: la app móvil (2023 — 2025)', en: 'Before: the mobile app (2023 — 2025)' },
    note: {
      es: 'Diseño en inglés, oscuro y solo móvil. Resolvía la agenda y el cobro, pero cada módulo vivía aparte.',
      en: 'English, dark, mobile-only design. It handled scheduling and checkout, but every module lived on its own.',
    },
    images: [
      shot('v1-calendar', 720, 1280, { es: 'Calendario del día de un barbero en la app móvil.', en: 'A barber’s day calendar in the mobile app.' }, { es: 'Calendario', en: 'Calendar' }),
      shot('v1-dashboard', 720, 1280, { es: 'Dashboard móvil con ventas por tipo.', en: 'Mobile dashboard with sales by type.' }, { es: 'Dashboard', en: 'Dashboard' }),
      shot('v1-commission', 360, 853, { es: 'Alta de un barbero por comisión: precios y comisión por servicio.', en: 'Adding a commission barber: prices and commission per service.' }, { es: 'Barbero por comisión', en: 'Commission barber' }),
      shot('v1-welcome', 720, 1316, { es: 'Cobro «Welcome back!» con la última cita para repetir.', en: '“Welcome back!” checkout with the last visit to rebook.' }, { es: 'Volver a reservar', en: 'Rebook' }),
    ],
  },
  roles: {
    title: { es: 'Cinco roles, cinco puertas de entrada', en: 'Five roles, five front doors' },
    items: [
      { role: { es: 'Dueño', en: 'Owner' }, scope: { es: 'Toda la empresa', en: 'The whole company' }, lands: { es: 'Métricas', en: 'Metrics' } },
      { role: { es: 'Administrador', en: 'Manager' }, scope: { es: 'Su sucursal', en: 'Their location' }, lands: { es: 'Métricas', en: 'Metrics' } },
      { role: { es: 'Recepción', en: 'Front desk' }, scope: { es: 'Su sucursal, sin cifras', en: 'Their location, no figures' }, lands: { es: 'Calendario', en: 'Calendar' } },
      { role: { es: 'Barbero por comisión', en: 'Commission barber' }, scope: { es: 'Solo lo suyo · «Lo que llevo»', en: 'Only their own · “What I’ve made”' }, lands: { es: 'Calendario', en: 'Calendar' } },
      { role: { es: 'Barbero de renta', en: 'Chair-rent barber' }, scope: { es: 'Lo suyo, con vista de negocio · «Mi negocio»', en: 'Their own, with a business view · “My business”' }, lands: { es: 'Calendario', en: 'Calendar' } },
    ] satisfies { role: L; scope: L; lands: L }[],
    insight: {
      es: 'El hallazgo más fuerte: el barbero que alquila la silla es «su propio negocio dentro de la barbería», pero la versión anterior no le mostraba ni sus ventas ni lo que debía de renta. La decisión fue darle lo mismo que a un dueño, recortado a él: ventas, propinas, renta, deducciones y su neto, aunque sea negativo.',
      en: 'The strongest finding: the barber who rents the chair is “their own business inside the shop”, but the old version showed them neither their sales nor the rent they owed. The decision was to give them what an owner sees, cut down to them: sales, tips, rent, deductions and their net, even when it’s negative.',
    },
  },
  after: {
    title: { es: 'Después: la plataforma web', en: 'After: the web platform' },
    images: [
      shot('platform-calendar', 2000, 1250, { es: 'Calendario por barbero con la línea de ahora y citas por estado.', en: 'Per-barber calendar with the now line and appointments by status.' }, { es: 'Calendario', en: 'Calendar' }),
      shot('platform-payroll', 2000, 1250, { es: 'Nómina de la semana: por pagar al equipo, por cobrar en rentas, comisiones y propinas.', en: 'Weekly payroll: owed to the team, rent to collect, commissions and tips.' }, { es: 'Nómina', en: 'Payroll' }),
      shot('platform-clients', 2000, 1250, { es: 'Clientes por segmento: nuevos, retenidos, frecuentes, en riesgo y perdidos.', en: 'Clients by segment: new, retained, frequent, at risk and lost.' }, { es: 'Clientes', en: 'Clients' }),
      shot('platform-transactions', 2000, 1250, { es: 'Transacciones: facturado, cobrado y por cobrar del periodo.', en: 'Transactions: billed, collected and outstanding for the period.' }, { es: 'Transacciones', en: 'Transactions' }),
      shot('platform-team', 2000, 1250, { es: 'Equipo: ocupación de sillas, servicios y personas por rol.', en: 'Team: chair occupancy, services and people by role.' }, { es: 'Equipo', en: 'Team' }),
      shot('platform-services', 2000, 1250, { es: 'Servicios con matriz de rentabilidad y margen promedio.', en: 'Services with a profitability matrix and average margin.' }, { es: 'Servicios', en: 'Services' }),
    ],
  },
  decisions: [
    { title: { es: 'El rol se aplica en el servidor', en: 'Roles enforced on the server' }, why: { es: 'Antes ninguna acción miraba el rol: un barbero veía el teléfono y la cuenta bancaria de sus colegas.', en: 'Before, no action checked the role: a barber could see colleagues’ phone numbers and bank accounts.' } },
    { title: { es: 'Recepción cobra, pero sin cifras', en: 'Front desk charges, without figures' }, why: { es: 'Ve el precio de cada cita, no los totales; el cierre de caja es a ciegas y la diferencia la ve gerencia.', en: 'They see each appointment’s price, not totals; the till closes blind and management sees the gap.' } },
    { title: { es: 'En el calendario la IA propone en la rejilla', en: 'In the calendar, AI proposes on the grid' }, why: { es: 'Nada se mueve solo y todo se deshace: las reseñas castigan a los calendarios que mueven sin preguntar.', en: 'Nothing moves on its own and everything can be undone: reviews punish calendars that move things without asking.' } },
    { title: { es: 'Nómina de lo variable, no de lo legal', en: 'Payroll for the variable part' }, why: { es: 'La nómina legal ya la hacen otros; lo que nadie hace bien es comisión, propinas y renta, con periodos que se aprueban y quedan fijos.', en: 'Legal payroll is already covered; what nobody does well is commission, tips and rent, with periods that get approved and locked.' } },
    { title: { es: 'Al cambiar un horario, ves a quién afecta', en: 'Changing hours shows who it affects' }, why: { es: 'Ninguno de los competidores revisados muestra las citas que quedan fuera antes de guardar.', en: 'None of the competitors reviewed shows the appointments left out before saving.' } },
    { title: { es: 'Nada de «IA» decorativa', en: 'No decorative “AI”' }, why: { es: 'Donde era una regla, el badge de IA se quitó y se llama «Sugerencia»: la marca de IA es solo para lo que pasa por un modelo.', en: 'Where it was just a rule, the AI badge was removed and renamed “Suggestion”: the AI mark is only for what goes through a model.' } },
  ] satisfies Decision[],
  calendarAi: {
    title: { es: 'Un calendario que propone', en: 'A calendar that proposes' },
    body: {
      es: 'Comparé 22 calendarios —de Google y Notion a los de barbería— y ninguno del sector era «inteligente» de verdad. La propuesta: cinco capacidades en orden, del hueco sugerido al reacomodo por retraso con vista previa y deshacer.',
      en: 'I compared 22 calendars —from Google and Notion to barbershop ones— and none in the industry was truly “smart”. The proposal: five capabilities in order, from suggested gaps to delay reflow with preview and undo.',
    },
    steps: [
      { es: 'Huecos sugeridos', en: 'Suggested gaps' },
      { es: 'Rellenar cancelaciones', en: 'Fill cancellations' },
      { es: 'Reacomodo por retraso', en: 'Delay reflow' },
      { es: 'Riesgo anticipado', en: 'Early risk warning' },
      { es: 'Abrir y cerrar el día', en: 'Open and close the day' },
    ] satisfies L[],
  },
}
