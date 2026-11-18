import type { L } from '@/lib/i18n'

/** Textos de interfaz del sitio (no de contenido). */
export const COPY = {
  skip: { es: 'Saltar al contenido', en: 'Skip to content' },
  nav: {
    work: { es: 'Proyectos', en: 'Work' },
    process: { es: 'Proceso', en: 'Process' },
    about: { es: 'Trayectoria', en: 'Journey' },
    agent: { es: 'Agente', en: 'Agent' },
    contact: { es: 'Contacto', en: 'Contact' },
  },
  hero: {
    noise: { es: 'Todo producto empieza como ruido.', en: 'Every product starts as noise.' },
    signal: { es: 'Mi trabajo es encontrar la señal.', en: 'My job is to find the signal.' },
    scroll: { es: 'Desliza para sintonizar', en: 'Scroll to tune in' },
    scrollHint: { es: 'Del ruido a la señal', en: 'From noise to signal' },
    loading: { es: 'Cargando señal', en: 'Loading signal' },
    tagline: {
      es: 'Diseño productos de punta a punta — de la investigación a la interfaz — y hoy también los construyo con IA.',
      en: 'I design products end to end — from research to interface — and today I also build them with AI.',
    },
  },
  manifesto: {
    label: { es: 'Manifiesto', en: 'Manifesto' },
    // [[x]] marca un chip con ícono dentro de la frase
    text: {
      es: 'Escucho a las personas [[research]] hasta que el ruido tiene forma. Lo ordeno en sistemas [[system]] que escalan. Y uso la IA [[ai]] para pasar de la idea al producto en días, no en meses.',
      en: 'I listen to people [[research]] until the noise takes shape. I organize it into systems [[system]] that scale. And I use AI [[ai]] to go from idea to product in days, not months.',
    },
  },
  process: {
    label: { es: 'Proceso', en: 'Process' },
    title: { es: 'Del ruido a la señal', en: 'From noise to signal' },
  },
  work: {
    label: { es: 'Frecuencias', en: 'Frequencies' },
    title: { es: 'Proyectos seleccionados', en: 'Selected work' },
    open: { es: 'Ver caso', en: 'View case' },
    placeholder: { es: 'Casos de ejemplo · contenido provisional', en: 'Sample cases · placeholder content' },
  },
  about: {
    label: { es: 'Trayectoria', en: 'Journey' },
    profile: { es: 'Perfil', en: 'Profile' },
    experience: { es: 'Experiencia', en: 'Experience' },
    education: { es: 'Educación', en: 'Education' },
    skills: { es: 'Habilidades', en: 'Skills' },
    tools: { es: 'Tecnología', en: 'Tools' },
  },
  agent: {
    label: { es: 'Agente', en: 'Agent' },
    title: { es: 'Sintoniza conmigo', en: 'Tune in with me' },
    intro: {
      es: 'Pregúntale a mi agente sobre mi experiencia, proceso o proyectos.',
      en: 'Ask my agent about my experience, process or projects.',
    },
    placeholder: { es: 'Escribe tu pregunta…', en: 'Type your question…' },
    send: { es: 'Enviar', en: 'Send' },
    disclaimer: {
      es: 'Demo: responde con la información de mi hoja de vida.',
      en: 'Demo: answers using the information from my résumé.',
    },
    you: { es: 'Tú', en: 'You' },
  },
  contact: {
    label: { es: 'Contacto', en: 'Contact' },
    title: { es: 'Hablemos', en: 'Let’s talk' },
    body: {
      es: '¿Tienes ruido que necesita convertirse en producto? Escríbeme.',
      en: 'Got noise that needs to become a product? Write to me.',
    },
    copy: { es: 'Copiar correo', en: 'Copy email' },
    copied: { es: 'Copiado', en: 'Copied' },
  },
  a11y: {
    open: { es: 'Accesibilidad', en: 'Accessibility' },
    title: { es: 'Ajustes de accesibilidad', en: 'Accessibility settings' },
    text: { es: 'Tamaño de texto', en: 'Text size' },
    contrast: { es: 'Alto contraste', en: 'High contrast' },
    motion: { es: 'Movimiento', en: 'Motion' },
    motionAuto: { es: 'Sistema', en: 'System' },
    motionReduced: { es: 'Reducido', en: 'Reduced' },
    motionFull: { es: 'Completo', en: 'Full' },
    links: { es: 'Subrayar enlaces', en: 'Underline links' },
    reset: { es: 'Restablecer', en: 'Reset' },
    close: { es: 'Cerrar', en: 'Close' },
  },
  language: { es: 'Idioma', en: 'Language' },
  case: {
    back: { es: 'Todos los proyectos', en: 'All work' },
    role: { es: 'Rol', en: 'Role' },
    team: { es: 'Equipo', en: 'Team' },
    duration: { es: 'Duración', en: 'Duration' },
    tools: { es: 'Herramientas', en: 'Tools' },
    year: { es: 'Año', en: 'Year' },
    placeholder: {
      es: 'Caso de ejemplo con contenido provisional — muestra la estructura del proceso.',
      en: 'Sample case with placeholder content — it shows the process structure.',
    },
    chapters: {
      problem: { es: 'El ruido', en: 'The noise' },
      research: { es: 'Frecuencia', en: 'Frequency' },
      idea: { es: 'La idea', en: 'The idea' },
      sketches: { es: 'Bocetos', en: 'Sketches' },
      form: { es: 'Forma', en: 'Form' },
      ai: { es: 'IA en el proceso', en: 'AI in the process' },
      results: { es: 'Transmisión', en: 'Broadcast' },
    },
    voices: { es: 'Lo que escuchamos', en: 'What we heard' },
    insights: { es: 'Hallazgos', en: 'Insights' },
    hmw: { es: '¿Cómo podríamos…?', en: 'How might we…?' },
    wire: { es: 'Wireframe', en: 'Wireframe' },
    ui: { es: 'Interfaz', en: 'Interface' },
    drag: { es: 'Arrastra o usa las flechas', en: 'Drag or use arrow keys' },
    learnings: { es: 'Aprendizajes', en: 'Learnings' },
    next: { es: 'Siguiente frecuencia', en: 'Next frequency' },
  },
  footer: {
    built: {
      es: 'Diseñado y construido por Elkin Garcia con IA.',
      en: 'Designed and built by Elkin Garcia with AI.',
    },
  },
} satisfies Record<string, unknown>

export type CopyText = L
