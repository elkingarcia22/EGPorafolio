import type { L } from '@/lib/i18n'
import type { CaseImage, ChapterIntro, TitledText } from './types'

const IMG = '/cases/barberlytics'
const shot = (name: string, width: number, height: number, alt: L, caption?: L): CaseImage => ({
  src: `${IMG}/${name}.webp`,
  width,
  height,
  alt,
  caption,
})

export const THEMA = {
  title: { es: 'Thema · el sistema de diseño', en: 'Thema · the design system' },
  intro: {
    kicker: { es: '¿Cómo diseñar rápido sin que cada pantalla invente sus reglas?', en: 'How do you design fast without every screen inventing its own rules?' },
    lead: {
      es: 'Thema nació de un legado de pantallas HTML con cuatro fuentes de tokens en conflicto. Lo convertí en un sistema estilo shadcn con temas intercambiables, documentación interactiva de cada pieza y algo que casi ningún sistema tiene: reglas escritas para que la IA también las siga.',
      en: 'Thema started from a legacy of HTML screens with four conflicting token sources. I turned it into a shadcn-style system with swappable themes, interactive docs for every piece and something almost no system has: rules written so the AI follows them too.',
    },
    stats: [
      { value: '218', label: { es: 'componentes en 22 familias', en: 'components in 22 families' } },
      { value: '10', label: { es: 'temas + uno que sale del logo', en: 'themes + one taken from the logo' } },
      { value: '113', label: { es: 'tokens', en: 'tokens' } },
      { value: '630', label: { es: 'ejemplos documentados', en: 'documented examples' } },
    ],
  } satisfies ChapterIntro,
  hero: shot('thema-home', 1140, 620, {
    es: 'Portada de la documentación de Thema: «Un solo sistema. Los temas que necesites.» con el selector de temas.',
    en: 'Thema docs home: “One system. The themes you need.” with the theme picker.',
  }),
  /** Un tema = un color primario; todo lo demás se deriva */
  themeModel: {
    title: { es: 'Un primario, un tema entero', en: 'One primary, a whole theme' },
    body: {
      es: 'Cada tema es solo un color primario por modo y una decisión sobre los neutros. Hover, superficies, modo oscuro y hasta el gradiente de la IA —que arranca en el primario y recorre 120° del círculo cromático— se calculan. Un test exige el contraste en los diez temas y en los dos modos. Y la barbería puede sacar su tema de su propio logo.',
      en: 'Each theme is just one primary per mode and a decision about neutrals. Hover, surfaces, dark mode and even the AI gradient —which starts at the primary and travels 120° around the color wheel— are computed. A test enforces contrast across all ten themes in both modes. And the shop can pull its theme from its own logo.',
    },
    /** Primario de cada tema en modo claro (src/themes/presets.ts) */
    swatches: [
      ['Azul', '#0C5BEF'], ['Premium', '#8A6420'], ['Premium Jade', '#1F7A5A'], ['Premium Platino', '#4A5B70'], ['Índigo', '#4F46E5'],
      ['Violeta', '#7C3AED'], ['Esmeralda', '#059669'], ['Teal', '#0D9488'], ['Cian', '#0891B2'], ['Rojo', '#DC2626'],
    ] as const,
    image: shot('thema-themes', 2000, 1567, {
      es: 'Página de temas de Thema: cada tema aplicado a la misma tarjeta, con su botón «Copiar CSS».',
      en: 'Thema themes page: every theme applied to the same card, with its “Copy CSS” button.',
    }),
  },
  foundations: [
    { title: { es: 'Tipografía', en: 'Typography' }, body: { es: '9 familias, cuerpo y títulos por separado; carga solo la elegida.', en: '9 families, body and headings set apart; only the chosen one loads.' } },
    { title: { es: 'Radios', en: 'Radii' }, body: { es: '7 pasos × 4 escalas, de recto a muy redondeado.', en: '7 steps × 4 scales, from square to very round.' } },
    { title: { es: 'Densidad', en: 'Density' }, body: { es: 'Compacta, normal o amplia, con alias de espaciado semánticos.', en: 'Compact, normal or comfortable, with semantic spacing aliases.' } },
    { title: { es: 'Motion', en: 'Motion' }, body: { es: '4 duraciones y 2 curvas; respeta «reducir movimiento».', en: '4 durations and 2 easings; honors “reduce motion”.' } },
    { title: { es: 'Iconos', en: 'Icons' }, body: { es: 'Nadie importa una librería: todo pasa por un registro. Cambiar de proveedor no tocó ningún componente.', en: 'Nobody imports a library: everything goes through a registry. Switching providers touched no component.' } },
    { title: { es: 'Significado fijo', en: 'Fixed meaning' }, body: { es: 'Positivo, negativo, aviso e info no cambian con el tema: «son significado, no decoración».', en: 'Positive, negative, warning and info never change with the theme: “they are meaning, not decoration”.' } },
  ] satisfies TitledText[],
  foundationImages: [
    shot('thema-colors', 2000, 1567, { es: 'Colores y tokens semánticos.', en: 'Colors and semantic tokens.' }, { es: 'Colores y tokens', en: 'Colors and tokens' }),
    shot('thema-typography', 2000, 1567, { es: 'Tipografía con muestra en vivo y código.', en: 'Typography with a live sample and code.' }, { es: 'Tipografía', en: 'Typography' }),
  ],
  /** Familias y cuántos componentes tiene cada una (ai-tools/catalog.json) */
  families: [
    ['ui', 46], ['ai', 18], ['atmosphere', 15], ['charts', 15], ['data-display', 14], ['layout', 13], ['date', 11], ['forms', 11],
    ['action-rail', 10], ['navigation', 9], ['selection', 9], ['overlays', 7], ['upload', 7], ['media', 6], ['feedback', 5],
    ['scheduling', 5], ['utility', 5], ['feedback-loop', 4], ['comments', 3], ['icons', 2], ['typography', 2], ['blocks', 1],
  ] as const,
  familiesNote: {
    es: 'Dos familias le dan carácter: «ai» (todo lo de Clipper) y «atmosphere», la capa de barbería: el poste, el pelo que cae, la línea de corte, el grano.',
    en: 'Two families give it character: “ai” (everything Clipper) and “atmosphere”, the barbershop layer: the pole, falling hair, the cut line, the grain.',
  },
  atmosphere: shot('thema-atmosphere', 2000, 1567, {
    es: 'Familia Atmósfera y marca: poste de barbería, pelo, línea de corte y halo.',
    en: 'Atmosphere and brand family: barber pole, hair, cut line and halo.',
  }),
  /** El diferencial: un sistema que la IA sigue */
  aiRules: {
    title: { es: 'Un sistema que la IA también sigue', en: 'A system the AI follows too' },
    lead: {
      es: 'Diseño y construyo con agentes de IA. Para que no se salieran del sistema, el sistema se volvió legible y verificable por ellos:',
      en: 'I design and build with AI agents. To keep them inside the system, the system became readable and checkable by them:',
    },
    rules: [
      { es: 'Todo sale del sistema: antes de escribir, se consulta el catálogo; si falta una pieza, se crea documentada.', en: 'Everything comes from the system: check the catalog before writing; a missing piece gets created, documented.' },
      { es: 'Iconos solo del registro.', en: 'Icons only from the registry.' },
      { es: 'Solo colores y letra del tema: cero HEX a mano.', en: 'Only theme colors and type: zero hand-written HEX.' },
      { es: 'Las piezas se ven como vienen; el marco pone el ancho de página.', en: 'Pieces look as they ship; the frame sets page width.' },
      { es: 'Se cierra validando, nunca silenciando una regla.', en: 'Work closes by validating, never by silencing a rule.' },
    ] satisfies L[],
    enforcement: [
      { title: { es: 'Catálogo generado', en: 'Generated catalog' }, body: { es: 'Una ficha por componente y un mapa del código que la IA lee antes de buscar.', en: 'One sheet per component and a code map the AI reads before searching.' } },
      { title: { es: '9 reglas automáticas', en: '9 automatic rules' }, body: { es: '«npm run check» falla con librerías ajenas, colores o tamaños a mano, o un catálogo viejo.', en: '“npm run check” fails on foreign libraries, hand-set colors or sizes, or a stale catalog.' } },
      { title: { es: 'Un guardián antes del disco', en: 'A guard before the disk' }, body: { es: 'Un hook bloquea la escritura si el código rompe el sistema, antes de que exista.', en: 'A hook blocks the write if the code breaks the system, before it exists.' } },
      { title: { es: '4 skills', en: '4 skills' }, body: { es: 'Elegir componentes, nueva pantalla, revisar contra el sistema y documentar.', en: 'Pick components, new screen, review against the system and document.' } },
    ] satisfies TitledText[],
    image: shot('thema-ai-guide', 2000, 1567, {
      es: 'Guía «Trabajar con la IA»: qué sabe la IA del proyecto y de dónde lo saca.',
      en: '“Working with AI” guide: what the AI knows about the project and where it gets it.',
    }),
  },
  quality: [
    { value: '212', label: { es: 'archivos de prueba', en: 'test files' } },
    { value: '~1.427', label: { es: 'casos de prueba', en: 'test cases' } },
    { value: '41', label: { es: 'pruebas de punta a punta', en: 'end-to-end tests' } },
  ],
}
