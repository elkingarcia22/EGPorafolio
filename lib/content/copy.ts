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
    noise: {
      es: 'Todo producto nace de una conexión entre lo que somos y lo que necesitamos.',
      en: 'Every product is born from a connection between who we are and what we need.',
    },
    signal: { es: 'Mi trabajo es diseñar el puente entre las dos.', en: 'My job is to design the bridge between the two.' },
    scroll: { es: 'Desliza para conectar', en: 'Scroll to connect' },
    scrollHint: { es: 'De ideas a producto', en: 'From ideas to product' },
    keepTuning: { es: 'Desliza para seguir conectando', en: 'Scroll to keep connecting' },
    loading: { es: 'Estableciendo conexiones', en: 'Making connections' },
    tagline: {
      es: 'Conecto investigación, diseño y tecnología para crear productos que la gente usa — y con IA, también los construyo.',
      en: 'I connect research, design and technology to create products people actually use — and with AI, I build them too.',
    },
  },
  manifesto: {
    label: { es: 'Manifiesto', en: 'Manifesto' },
    // [[x]] marca un chip con ícono dentro de la frase
    text: {
      es: 'Escucho a las personas [[research]] hasta encontrar los puntos que importan. Los conecto en sistemas [[system]] que escalan. Y uso la IA [[ai]] para pasar de la idea al producto en días, no en meses.',
      en: 'I listen to people [[research]] until I find the dots that matter. I connect them into systems [[system]] that scale. And I use AI [[ai]] to go from idea to product in days, not months.',
    },
  },
  process: {
    label: { es: 'Proceso', en: 'Process' },
    title: { es: 'De puntos a conexiones', en: 'From dots to connections' },
  },
  work: {
    label: { es: 'Nodos', en: 'Nodes' },
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
    earlier: { es: 'Antes del producto digital', en: 'Before digital product' },
    certifications: { es: 'Certificaciones', en: 'Certifications' },
  },
  agent: {
    label: { es: 'Agente', en: 'Agent' },
    title: { es: 'Conectemos', en: 'Let’s connect' },
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
      es: '¿Tienes ideas que necesitan conectarse para convertirse en producto? Escríbeme.',
      en: 'Got ideas that need connecting to become a product? Write to me.',
    },
    copy: { es: 'Copiar correo', en: 'Copy email' },
    copied: { es: 'Copiado', en: 'Copied' },
    email: { es: 'Escríbeme un correo', en: 'Send me an email' },
    call: { es: 'Llámame', en: 'Call me' },
    whatsapp: { es: 'Escríbeme por WhatsApp', en: 'Message me on WhatsApp' },
    linkedin: { es: 'Conectemos en LinkedIn', en: 'Connect on LinkedIn' },
    mailSubject: { es: 'Hola Elkin — vi tu portafolio', en: 'Hi Elkin — I saw your portfolio' },
    waMessage: {
      es: 'Hola Elkin, vi tu portafolio y me gustaría hablar contigo.',
      en: 'Hi Elkin, I saw your portfolio and I’d like to talk with you.',
    },
    networkAlt: { es: 'Red de conexiones animada: impulsos que viajan entre nodos', en: 'Animated network: impulses travelling between nodes' },
    available: { es: 'Disponible para nuevos proyectos', en: 'Open to new projects' },
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
  connections: { es: 'conexiones', en: 'connections' },
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
      problem: { es: 'Los puntos', en: 'The dots' },
      research: { es: 'Patrones', en: 'Patterns' },
      idea: { es: 'La idea', en: 'The idea' },
      sketches: { es: 'Bocetos', en: 'Sketches' },
      form: { es: 'Forma', en: 'Form' },
      ai: { es: 'IA en el proceso', en: 'AI in the process' },
      results: { es: 'Impacto', en: 'Impact' },
    },
    voices: { es: 'Lo que escuchamos', en: 'What we heard' },
    insights: { es: 'Hallazgos', en: 'Insights' },
    hmw: { es: '¿Cómo podríamos…?', en: 'How might we…?' },
    wire: { es: 'Wireframe', en: 'Wireframe' },
    ui: { es: 'Interfaz', en: 'Interface' },
    drag: { es: 'Arrastra o usa las flechas', en: 'Drag or use arrow keys' },
    learnings: { es: 'Aprendizajes', en: 'Learnings' },
    next: { es: 'Siguiente proyecto', en: 'Next project' },
  },
  footer: {
    built: {
      es: 'Diseñado y construido por Elkin Garcia con IA.',
      en: 'Designed and built by Elkin Garcia with AI.',
    },
  },
} satisfies Record<string, unknown>

export type CopyText = L
