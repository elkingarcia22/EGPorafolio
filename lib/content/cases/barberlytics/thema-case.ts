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

  /**
   * Lo que dice cada capítulo del caso rediseñado: una frase arriba y un apoyo
   * de dos renglones como máximo. Todo sale del contenido de abajo.
   */
  chapters: {
    puntos: {
      phrase: { es: 'Una barbería no quiere usar un software: quiere sentir que es suyo.', en: 'A barbershop doesn’t want to use software: it wants to feel it’s theirs.' },
      lead: { es: 'Barberías con identidades muy distintas usaban un producto que se sentía prestado. Toca una carta para ver el porqué.', en: 'Shops with very different identities used a product that felt borrowed. Tap a card to see why.' },
    },
    patrones: {
      phrase: { es: 'Cuatro fuentes de tokens, una sola decisión por token.', en: 'Four token sources, one decision per token.' },
      lead: { es: 'Antes de diseñar una pieza puse todo sobre la mesa: qué decía cada fuente y qué no queríamos nunca.', en: 'Before designing a piece I put everything on the table: what each source said and what we never wanted.' },
    },
    idea: {
      lead: { es: 'Cuatro principios, cada uno probándose con el mismo color. Toca uno para leerlo.', en: 'Four principles, each one tested with the same color. Tap one to read it.' },
    },
    bocetos: {
      phrase: { es: 'Barbería más métricas: un solo signo.', en: 'Barbershop plus metrics: a single sign.' },
      lead: { es: 'Seis direcciones con el mismo ADN —carbón, oro y crecimiento— y lo que se queda: la flecha que sube.', en: 'Six directions with the same DNA —charcoal, gold and growth— and what stays: the rising arrow.' },
    },
    forma: {
      phrase: { es: 'Un color, y la app cambia de identidad.', en: 'One color, and the app changes identity.' },
      lead: { es: 'La barbería elige su tema o lo saca de su logo; el sistema calcula el resto. Prueba tu color.', en: 'The shop picks its theme or pulls it from its logo; the system computes the rest. Try your color.' },
    },
    ia: {
      phrase: { es: 'La IA lee lo mismo que las personas, y el sistema la frena cuando se equivoca.', en: 'AI reads what people read, and the system stops it when it’s wrong.' },
      lead: { es: 'Cada pedido pasa por el catálogo, un guardián y las validaciones antes de llegar al código. Toca una estación.', en: 'Every request goes through the catalog, a guard and the checks before reaching code. Tap a station.' },
    },
    impacto: {
      phrase: { es: 'Una pantalla nueva se arma en lugar de dibujarse.', en: 'A new screen is assembled instead of drawn.' },
      lead: { es: 'De 27 componentes aprobados a 218 documentados: las personas y la IA usan las mismas piezas.', en: 'From 27 approved components to 218 documented: people and AI use the same pieces.' },
    },
    demo: {
      phrase: { es: 'Explora Thema, el sistema de diseño.', en: 'Explore Thema, the design system.' },
      lead: { es: 'Es la documentación real, funcionando. Cambia el tema y mira cómo cambia todo.', en: 'It’s the real documentation, running. Switch the theme and watch everything change.' },
    },
  },

  themes: [
    theme('premium', 'Premium', '#D9B36A', '#3F72D8'),
    theme('thema', 'Azul', '#0C5BEF', '#E11D48'),
    theme('emerald', 'Esmeralda', '#059669', '#4F46E5'),
    theme('crimson', 'Rojo', '#F87171', '#F59E0B'),
    theme('violet', 'Violeta', '#7C3AED', '#F97316'),
    theme('premium-jade', 'Premium Jade', '#7FD8AF', '#7C6CF0'),
  ] satisfies ThemeShot[],

  /** 01 · Los puntos: la personalización como punto de partida */
  dots: {
    kicker: { es: 'Una barbería no quiere usar un software: quiere sentir que es suyo.', en: 'A barbershop doesn’t want to use software: it wants to feel it’s theirs.' },
    lead: {
      es: 'Barberlytics lo usan barberías con identidades muy distintas: la clásica de oro y carbón, la de barrio en rojo, la moderna en verde. Un producto genérico se sentía prestado. Buscábamos que cada barbería pudiera personalizarlo —elegir su tema o sacarlo de su propio logo— para que lo sintiera parte de su negocio, le diera más pertenencia y lo usara más. Y eso tenía que funcionar sin que nadie, ni una persona ni una IA, pudiera romperlo.',
      en: 'Barberlytics is used by shops with very different identities: the classic gold-and-charcoal one, the neighborhood one in red, the modern one in green. A generic product felt borrowed. We wanted each shop to personalize it —pick its theme or pull it from its own logo— so it felt part of their business, gave them more belonging and got used more. And it had to work without anyone, person or AI, being able to break it.',
    },
    seen: [
      { title: { es: 'Cada barbería tiene su marca', en: 'Every shop has its brand' }, body: { es: 'Colores, logo y estilo propios. Con la app de otro color, el dueño la sentía ajena y sus clientes también.', en: 'Its own colors, logo and style. With an app in someone else’s color, owners felt it foreign, and so did their clients.' } },
      { title: { es: 'Personalizar no podía romper nada', en: 'Personalizing couldn’t break anything' }, body: { es: 'Si cada barbería elige su color, el contraste tiene que seguir pasando y «éxito» o «error» tienen que seguir significando lo mismo.', en: 'If every shop picks its color, contrast must still pass and “success” or “error” must still mean the same.' } },
      { title: { es: 'Y por dentro, cuatro verdades', en: 'And inside, four truths' }, body: { es: 'Cuatro fuentes de tokens en conflicto y agentes de IA que inventaban piezas en cada pantalla.', en: 'Four conflicting token sources and AI agents inventing pieces on every screen.' } },
    ] satisfies TitledText[],
    stats: [
      { value: '10', label: { es: 'temas listos para elegir', en: 'ready-made themes' } },
      { value: '1', label: { es: 'tema propio, sacado del logo', en: 'own theme, taken from the logo' } },
      { value: '1', label: { es: 'color basta para cambiar todo', en: 'color is enough to change everything' } },
      { value: '4', label: { es: 'fuentes de tokens en conflicto al empezar', en: 'conflicting token sources at the start' } },
    ] satisfies CaseStat[],
  },

  /** 02 · Patrones: inventario, matriz de tokens, lo prohibido y la auditoría */
  patterns: {
    lead: {
      es: 'El patrón que más se repetía: cada barbería quería verse a sí misma en la app. La respuesta fue un sistema de temas donde basta un color —elegido o sacado del logo— para que todo el producto cambie de identidad. Pruébalo: elige un tema o tu propio color.',
      en: 'The most repeated pattern: every shop wanted to see itself in the app. The answer was a theme system where one color —picked or pulled from the logo— is enough for the whole product to change identity. Try it: pick a theme or your own color.',
    },
    matrixLead: {
      es: 'Por dentro, antes de diseñar una sola pieza, puse todo sobre la mesa: qué decía cada fuente de tokens y qué no queríamos nunca. De cada token salió una decisión con su motivo.',
      en: 'Inside, before designing a single piece, I put everything on the table: what each token source said and what we never wanted. Every token got a decision with its reason.',
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
      { es: 'Personalizar genera pertenencia: cuando la app tiene los colores de la barbería, el dueño la muestra y la usa como suya.', en: 'Personalizing builds belonging: when the app has the shop’s colors, owners show it off and use it as theirs.' },
      { es: 'Un tema no debía ser una paleta entera: con un color primario se podía calcular todo lo demás.', en: 'A theme didn’t have to be a whole palette: from one primary everything else could be computed.' },
      { es: 'Lo que tiene significado —éxito, error, aviso— no cambia con el tema.', en: 'Whatever carries meaning —success, error, warning— doesn’t change with the theme.' },
      { es: 'Si la IA arma pantallas, el sistema tiene que poder leerse y verificarse solo.', en: 'If AI builds screens, the system has to be readable and self-checking.' },
    ] satisfies L[],
  },

  /** 03 · La idea */
  idea: {
    hmw: {
      es: '¿Cómo podríamos hacer que cada barbería sienta la app como suya con un solo color, sin que una persona o una IA puedan romperla?',
      en: 'How might we make every shop feel the app is theirs with a single color, without a person or an AI being able to break it?',
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
        { x: 5, y: 70, w: 31, h: 6, title: { es: 'Empezar por las piezas', en: 'Start from the pieces' }, body: { es: 'Cada componente con su zona de pruebas, ejemplos, props y guías de uso.', en: 'Each component with its sandbox, examples, props and usage guides.' } },
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
      es: 'Es la documentación real de Thema, funcionando aquí: la portada, la marca y una muestra de componentes. Cambia el tema arriba a la derecha y mira cómo cambia todo.',
      en: 'It’s Thema’s real documentation, running here: the home, the brand and a sample of components. Switch the theme at the top right and watch everything change.',
    },
    /** `vitrina=1`: la doc muestra solo la portada, la marca y una muestra de componentes, también en pestaña nueva. */
    open: 'https://barberlytics.vercel.app/docs?vitrina=1',
  },
}
