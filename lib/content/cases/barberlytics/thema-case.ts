import type { L } from '@/lib/i18n'
import type { Callout } from '@/components/case/kit/device'
import type { CaseImage, CaseStat, TitledText } from './types'

const IMG = '/cases/barberlytics'
const img = (name: string, width: number, height: number, alt: L): CaseImage => ({ src: `${IMG}/${name}.webp`, width, height, alt })

/** Un tema del sistema con su captura de la portada de la documentación. */
export interface ThemeShot {
  id: string
  name: string
  /** Primario del tema (el que se ve en la captura) */
  primary: string
  /** Fin del gradiente de IA: el primario girado 120° (o el que fija el tema) */
  aiEnd: string
  image: CaseImage
}

const theme = (id: string, name: string, primary: string, aiEnd: string): ThemeShot => ({
  id,
  name,
  primary,
  aiEnd,
  image: img(`theme-${id}`, 1400, 817, { es: `La documentación de Thema con el tema ${name}.`, en: `Thema’s docs in the ${name} theme.` }),
})

/** Componente real del sistema (captura del playground de su ficha). */
const comp = (id: string, name: string, family: string, width: number, height: number) => ({
  id,
  name,
  family,
  image: img(`comp-${id}`, width, height, { es: `${name}, componente de Thema.`, en: `${name}, a Thema component.` }),
})

/** Caso «Thema»: el sistema de diseño de Barberlytics. */
export const THEMA_CASE = {
  slug: 'thema',
  index: '01',
  title: { es: 'Thema', en: 'Thema' },
  eyebrow: { es: 'Sistema de diseño', en: 'Design system' },
  tagline: {
    es: 'Un sistema de diseño donde un color basta para cambiar de identidad, y cuyas reglas siguen igual las personas que la IA.',
    en: 'A design system where one color is enough to change identity, and whose rules people and AI follow alike.',
  },
  meta: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Diseño del sistema, marca y gobernanza', en: 'System design, brand and governance' } },
    { label: { es: 'Alcance', en: 'Scope' }, value: { es: 'Tokens, temas, 218 componentes y documentación', en: 'Tokens, themes, 218 components and docs' } },
    { label: { es: 'Base', en: 'Base' }, value: { es: 'shadcn + Radix, con identidad propia', en: 'shadcn + Radix, with its own identity' } },
    { label: { es: 'Año', en: 'Year' }, value: { es: '2026', en: '2026' } },
  ] satisfies { label: L; value: L }[],
  tools: ['Claude Code', 'React', 'TypeScript', 'Tailwind', 'Radix'],

  themes: [
    theme('premium', 'Premium', '#D9B36A', '#3F72D8'),
    theme('thema', 'Azul', '#0C5BEF', '#E11D48'),
    theme('emerald', 'Esmeralda', '#059669', '#4F46E5'),
    theme('crimson', 'Rojo', '#F87171', '#F59E0B'),
    theme('violet', 'Violeta', '#7C3AED', '#F97316'),
    theme('premium-jade', 'Premium Jade', '#7FD8AF', '#7C6CF0'),
  ] satisfies ThemeShot[],

  /** 01 · Los puntos */
  dots: {
    kicker: { es: 'Cada pantalla nueva inventaba sus propias reglas.', en: 'Every new screen invented its own rules.' },
    lead: {
      es: 'Thema empezó con un legado de pantallas HTML de otra plataforma y cuatro fuentes de tokens que se contradecían. Al mismo tiempo, cada vez más pantallas las armaban agentes de IA, que sin reglas claras escribían colores a mano o traían otra librería. Y la marca tenía su propio problema: no tenía isotipo y su oro casi no se leía sobre blanco.',
      en: 'Thema started from a legacy of HTML screens from another platform and four token sources that contradicted each other. Meanwhile, more and more screens were built by AI agents that, without clear rules, hand-wrote colors or pulled in another library. And the brand had its own problem: no isotype, and its gold barely read on white.',
    },
    seen: [
      { title: { es: 'Cuatro verdades distintas', en: 'Four different truths' }, body: { es: 'Starter, comparativo, legado y sistema oficial: cada uno con su fondo, su azul y su radio.', en: 'Starter, comparison, legacy and the official system: each with its own background, blue and radius.' } },
      { title: { es: 'La IA no sabía qué existía', en: 'The AI didn’t know what existed' }, body: { es: 'Sin un catálogo legible, inventaba una tarjeta nueva en cada pantalla en lugar de usar la que ya estaba.', en: 'Without a readable catalog it invented a new card on every screen instead of using the existing one.' } },
      { title: { es: 'Una marca que se rompía en chico', en: 'A brand that broke when small' }, body: { es: 'Sin isotipo, a 32 o 16 px no había nada que poner en el menú ni en la pestaña.', en: 'Without an isotype, at 32 or 16 px there was nothing to put in the rail or the tab.' } },
    ] satisfies TitledText[],
    stats: [
      { value: '4', label: { es: 'fuentes de tokens en conflicto', en: 'conflicting token sources' } },
      { value: '21', label: { es: 'componentes críticos que faltaban', en: 'critical components missing' } },
      { value: '27', label: { es: 'componentes aprobados al empezar', en: 'components approved at the start' } },
      { value: '0', label: { es: 'isotipo en la marca', en: 'isotypes in the brand' } },
    ] satisfies CaseStat[],
  },

  /** 02 · Patrones: inventario, matriz de tokens, lo prohibido y la auditoría */
  patterns: {
    lead: {
      es: 'Antes de diseñar una sola pieza puse todo sobre la mesa: qué tenía el legado, qué decía cada fuente de tokens y qué no queríamos nunca. De cada token salió una decisión con su motivo.',
      en: 'Before designing a single piece I put everything on the table: what the legacy had, what each token source said and what we never wanted. Every token got a decision with its reason.',
    },
    columns: [
      {
        title: { es: 'Fuentes en conflicto', en: 'Conflicting sources' },
        color: 'orange',
        notes: [
          { es: 'Starter: azul genérico y radios chicos', en: 'Starter: generic blue, small radii' },
          { es: 'Comparativo: otra escala de grises', en: 'Comparison: another gray scale' },
          { es: 'Legado: HEX escritos en cada pantalla', en: 'Legacy: HEX written on every screen' },
          { es: 'Sistema oficial: el que debía ganar', en: 'Official system: the one that should win' },
        ],
      },
      {
        title: { es: 'Decisión y motivo', en: 'Decision and reason' },
        color: 'green',
        notes: [
          { es: 'Fondo #F4F6F8 · «el sistema oficial gana sobre el legado»', en: 'Background #F4F6F8 · “official beats legacy”' },
          { es: 'Primario #0C5BEF · consenso total', en: 'Primary #0C5BEF · full consensus' },
          { es: 'Radio grande 16 px · radios amplios', en: 'Large radius 16 px · generous radii' },
          { es: 'Base de 4 px para todo el espaciado', en: '4 px base for all spacing' },
        ],
      },
      {
        title: { es: 'Prohibido', en: 'Off-limits' },
        color: 'pink',
        notes: [
          { es: 'Glassmorphism y gradientes «premium» de adorno', en: 'Glassmorphism and decorative “premium” gradients' },
          { es: 'Sombras difusas: mejor bordes de 1 px', en: 'Diffuse shadows: 1 px borders instead' },
          { es: 'Animación cosmética', en: 'Cosmetic animation' },
          { es: 'HEX a mano en un componente', en: 'Hand-written HEX in a component' },
        ],
      },
      {
        title: { es: 'Auditoría', en: 'Audit' },
        color: 'blue',
        notes: [
          { es: '27 componentes aprobados', en: '27 components approved' },
          { es: '21 faltantes, priorizados', en: '21 missing, prioritized' },
          { es: 'Críticos: aviso, menú, tooltip, casillas, switch', en: 'Critical: alert, menu, tooltip, checks, switch' },
          { es: 'Para cada pieza: envolver shadcn, usarlo tal cual o crearla', en: 'Per piece: wrap shadcn, use as-is or build it' },
        ],
      },
    ],
    insights: [
      { es: 'Un tema no debía ser una paleta entera: con un color primario se podía calcular todo lo demás.', en: 'A theme didn’t have to be a whole palette: from one primary everything else could be computed.' },
      { es: 'Lo que tiene significado —éxito, error, aviso— no cambia con el tema.', en: 'Whatever carries meaning —success, error, warning— doesn’t change with the theme.' },
      { es: 'Si la IA arma pantallas, el sistema tiene que poder leerse y verificarse solo.', en: 'If AI builds screens, the system has to be readable and self-checking.' },
    ] satisfies L[],
  },

  /** 03 · La idea */
  idea: {
    hmw: {
      es: '¿Cómo podríamos tener un sistema que cambie de identidad con un solo color, y que ni una persona ni una IA puedan romper sin darse cuenta?',
      en: 'How might we have a system that changes identity with one color, and that neither a person nor an AI can break without noticing?',
    },
    principles: [
      { title: { es: 'Un primario, un tema entero', en: 'One primary, a whole theme' }, body: { es: 'Hover, superficies, modo oscuro y el gradiente de la IA se derivan. Añadir un tema es añadir una línea.', en: 'Hover, surfaces, dark mode and the AI gradient are derived. Adding a theme is adding one line.' } },
      { title: { es: 'El significado no se tematiza', en: 'Meaning isn’t themed' }, body: { es: 'Éxito, error, aviso e información son iguales en todos los temas.', en: 'Success, error, warning and info are the same in every theme.' } },
      { title: { es: 'Las piezas se ven como vienen', en: 'Pieces look as they ship' }, body: { es: 'Desde afuera solo se decide dónde va un componente, no cómo se ve.', en: 'From outside you only decide where a component goes, not how it looks.' } },
      { title: { es: 'La IA lee lo mismo que las personas', en: 'AI reads what people read' }, body: { es: 'Un catálogo generado, reglas escritas y validaciones que bloquean antes de que algo llegue al código.', en: 'A generated catalog, written rules and checks that block before anything reaches the code.' } },
    ] satisfies TitledText[],
  },

  /** 05 · Forma */
  form: {
    themesLead: {
      es: 'La misma portada de la documentación en seis temas. Solo cambia el color primario; el sistema calcula el resto, incluido el gradiente de la IA.',
      en: 'The same docs home in six themes. Only the primary color changes; the system computes the rest, AI gradient included.',
    },
    components: [
      comp('kpi-card', 'KpiCard', 'charts', 1400, 669),
      comp('day-strip', 'DayStrip', 'scheduling', 1400, 409),
      comp('donut-chart', 'DonutChart', 'charts', 1400, 685),
      comp('ticket-card', 'TicketCard', 'scheduling', 1400, 415),
      comp('barber-pole', 'BarberPole', 'atmosphere', 1400, 478),
      comp('heatmap-chart', 'HeatmapChart', 'charts', 1400, 748),
      comp('time-slot-groups', 'TimeSlotGroups', 'scheduling', 1400, 409),
      comp('line-chart', 'LineChart', 'charts', 1400, 654),
      comp('barberlytics-logo', 'BarberlyticsLogo', 'brand', 1400, 414),
      comp('selectable-card', 'SelectableCard', 'selection', 1400, 409),
      comp('event-calendar', 'EventCalendar', 'date', 1400, 1340),
      comp('chat-composer', 'ChatComposer', 'ai', 1400, 477),
      comp('table', 'Table', 'data-display', 1400, 441),
      comp('bar-chart', 'BarChart', 'charts', 1400, 654),
      comp('metric-card', 'MetricCard', 'data-display', 1400, 1085),
    ],
    familiesNote: {
      es: '218 componentes en 22 familias. Dos le dan carácter: «ai», todo lo de Clipper, y «atmosphere», la capa de barbería: el poste, el pelo que cae, la línea de corte.',
      en: '218 components in 22 families. Two give it character: “ai”, everything Clipper, and “atmosphere”, the barbershop layer: the pole, falling hair, the cut line.',
    },
    docs: {
      title: { es: 'La documentación, también el producto', en: 'The docs, also the product' },
      image: img('thema-home', 1140, 620, { es: 'Portada de la documentación de Thema.', en: 'Thema docs home.' }),
      callouts: [
        { x: 5, y: 17, w: 41, h: 33, title: { es: 'Una promesa clara', en: 'A clear promise' }, body: { es: '«Un solo sistema. Los temas que necesites.» Con el gradiente del tema activo.', en: '“One system. The themes you need.” In the active theme’s gradient.' } },
        { x: 59.6, y: 16, w: 35.4, h: 52, title: { es: 'El tema se cambia en vivo', en: 'Themes switch live' }, body: { es: 'Diez temas, radio, densidad y tipografía; todo se puede exportar como CSS.', en: 'Ten themes, radius, density and typography; all exportable as CSS.' } },
        { x: 5, y: 70, w: 31, h: 6, title: { es: 'Empezar por las piezas', en: 'Start from the pieces' }, body: { es: 'Cada componente con su playground, ejemplos, props y guías de uso.', en: 'Each component with its playground, examples, props and usage guides.' } },
        { x: 0, y: 84, w: 100, h: 16, title: { es: 'El sistema en cifras', en: 'The system in numbers' }, body: { es: '218 componentes, 22 familias, 10 temas y 103 tokens por tema.', en: '218 components, 22 families, 10 themes and 103 tokens per theme.' } },
      ] satisfies Callout[],
    },
    foundations: [
      img('thema-typography', 2000, 1567, { es: 'Tipografía: cuerpo y títulos por separado.', en: 'Typography: body and headings set apart.' }),
      img('thema-colors', 2000, 1567, { es: 'Colores y tokens semánticos.', en: 'Colors and semantic tokens.' }),
    ],
  },

  /** 06 · IA en el proceso */
  ai: {
    lead: {
      es: 'Diseño y construyo con agentes de IA. Para que no se salieran del sistema, el sistema se volvió algo que la IA puede leer, seguir y que la frena cuando se equivoca.',
      en: 'I design and build with AI agents. To keep them inside the system, the system became something the AI can read and follow, and that stops it when it’s wrong.',
    },
    rules: [
      { es: 'Todo sale del sistema. Antes de escribir se consulta el catálogo; si falta una pieza, se crea documentada, nunca como un «div» en la pantalla.', en: 'Everything comes from the system. Check the catalog first; a missing piece gets created, documented, never as a “div” on the screen.' },
      { es: 'Iconos solo del registro.', en: 'Icons only from the registry.' },
      { es: 'Colores y letra del tema. Cero HEX a mano.', en: 'Theme colors and type. Zero hand-written HEX.' },
      { es: 'Las piezas se ven como vienen; el marco pone el ancho de página.', en: 'Pieces look as they ship; the frame sets page width.' },
      { es: 'Se cierra validando, nunca silenciando una regla.', en: 'Work closes by validating, never by silencing a rule.' },
    ] satisfies L[],
    catalogLines: [
      '**218 componentes** en 22 familias · 101 iconos en el registro · 113 tokens.',
      '- **KpiCard** [kpi-card] — Tarjeta de indicador para dashboards: título, valor grande…',
      '- **DayStrip** [day-strip] — La tira de días de la reserva: el día arriba y el número grande…',
      '- **ClipperOrb** [clipper-orb] — El símbolo de la IA en todo el sistema…',
      '- **BarberPole** [barber-pole] — El poste de barbería girando…',
    ],
    checks: [
      { es: 'Ninguna otra librería de interfaz ni de iconos', en: 'No other UI or icon library' },
      { es: 'Ningún color escrito a mano', en: 'No hand-written color' },
      { es: 'Nada de la paleta cruda de Tailwind', en: 'Nothing from Tailwind’s raw palette' },
      { es: 'Ningún tamaño de letra ni capa fijados a mano', en: 'No hand-set font size or layer' },
      { es: 'Ningún SVG pegado en una pantalla', en: 'No pasted SVG in a screen' },
      { es: 'Ninguna pantalla con su propio ancho', en: 'No screen with its own width' },
      { es: 'Ningún icono que no exista; ninguna pantalla sin ruta', en: 'No missing icon; no screen without a route' },
      { es: 'Archivos protegidos sin tocar', en: 'Protected files untouched' },
      { es: 'Catálogo y mapa del código al día', en: 'Catalog and code map up to date' },
    ] satisfies L[],
    layers: [
      { title: { es: 'Catálogo generado', en: 'Generated catalog' }, body: { es: 'Una línea por componente para elegir, y una ficha con props y ejemplos. Nadie lo edita a mano.', en: 'One line per component to choose, and a sheet with props and examples. Nobody edits it by hand.' } },
      { title: { es: 'Un guardián antes del disco', en: 'A guard before the disk' }, body: { es: 'Si el código trae otra librería, un HEX o un tamaño fijo, la escritura se bloquea antes de existir.', en: 'If the code brings another library, a HEX or a fixed size, the write is blocked before it exists.' } },
      { title: { es: '4 habilidades', en: '4 skills' }, body: { es: 'Elegir componentes, armar una pantalla nueva, revisar contra el sistema y documentar una pieza.', en: 'Pick components, build a new screen, review against the system and document a piece.' } },
    ] satisfies TitledText[],
    guide: img('thema-ai-guide', 2000, 1567, { es: 'Guía «Trabajar con la IA» en la documentación.', en: '“Working with AI” guide in the docs.' }),
  },

  /**
   * 07 · Impacto. Las cifras del sistema salen del repositorio; las dos de equipo
   * (velocidad y retrabajo) son de referencia, definidas por el autor.
   */
  impact: {
    lead: {
      es: 'Con Thema, una pantalla nueva se arma en lugar de dibujarse: las personas y la IA usan las mismas piezas y las mismas reglas, y lo que se sale del sistema no llega al código.',
      en: 'With Thema, a new screen is assembled instead of drawn: people and AI use the same pieces and rules, and anything off-system never reaches the code.',
    },
    kpis: [
      { label: { es: 'Componentes documentados', en: 'Documented components' }, value: 218, unit: '', note: { es: 'antes 27 aprobados', en: 'from 27 approved' } },
      { label: { es: 'Para armar una pantalla nueva', en: 'To build a new screen' }, value: 3, unit: '×', note: { es: 'más rápido que antes', en: 'faster than before' } },
      { label: { es: 'Ajustes visuales en revisión', en: 'Visual fixes in review' }, value: 70, unit: '%', note: { es: 'menos', en: 'fewer' } },
      { label: { es: 'Colores a mano en pantallas nuevas', en: 'Hand-set colors in new screens' }, value: 0, unit: '', note: { es: 'los bloquea el sistema', en: 'blocked by the system' } },
    ],
    growth: {
      title: { es: 'Componentes documentados', en: 'Documented components' },
      bars: [
        { label: { es: 'Auditoría', en: 'Audit' }, value: 27 },
        { label: { es: 'Primera versión', en: 'First version' }, value: 159 },
        { label: { es: 'Hoy', en: 'Today' }, value: 218 },
      ],
    },
    quality: [
      { value: '630', label: { es: 'ejemplos con código', en: 'examples with code' } },
      { value: '212', label: { es: 'archivos de prueba', en: 'test files' } },
      { value: '41', label: { es: 'pruebas de punta a punta', en: 'end-to-end tests' } },
      { value: '10', label: { es: 'temas con contraste verificado', en: 'themes with verified contrast' } },
    ],
    learnings: [
      { es: 'Un sistema para equipos con IA no es una librería: es un contrato que la máquina puede leer y hacer cumplir.', en: 'A system for AI-assisted teams isn’t a library: it’s a contract the machine can read and enforce.' },
      { es: 'Derivar en vez de definir: con un color por tema, diez temas cuestan lo mismo que uno.', en: 'Derive instead of define: with one color per theme, ten themes cost the same as one.' },
    ] satisfies L[],
  },

  /** 08 · Demo: la documentación real */
  demo: {
    lead: {
      es: 'Es la documentación real de Thema, funcionando aquí. Cambia el tema arriba a la derecha y mira cómo cambia todo.',
      en: 'It’s Thema’s real documentation, running here. Switch the theme at the top right and watch everything change.',
    },
    pages: [
      { id: 'home', name: { es: 'Inicio', en: 'Home' }, url: 'https://barberlytics.vercel.app/docs' },
      { id: 'themes', name: { es: 'Temas', en: 'Themes' }, url: 'https://barberlytics.vercel.app/docs#/foundations/themes' },
      { id: 'ai', name: { es: 'Componentes de IA', en: 'AI components' }, url: 'https://barberlytics.vercel.app/docs#/group/ai' },
      { id: 'atmosphere', name: { es: 'Atmósfera', en: 'Atmosphere' }, url: 'https://barberlytics.vercel.app/docs#/group/atmosphere' },
    ],
    open: 'https://barberlytics.vercel.app/docs',
  },
}
