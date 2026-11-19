/**
 * Revisa a qué tema va cada pregunta del respaldo local del agente.
 * Uso: npx tsx --tsconfig tsconfig.json scripts/check-agent-routing.ts
 */
import { routeTopic } from '../lib/agent/answer'
const cases: [string, string | null][] = [
  // vibe coding / construir
  ['cuentame como trabajas con vibe coding', 'vibe'], ['Hola cuentame como trabajs con vide coding', 'vibe'], ['programas?', 'vibe'], ['sabes programar', 'vibe'], ['haces codigo tu mismo', 'vibe'], ['usas cursor o claude code', 'vibe'], ['como construiste este portafolio', 'vibe'], ['do you code?', 'vibe'], ['eres desarrollador o diseñador', 'vibe'],
  // proceso
  ['cual es tu proceso de diseño', 'process'], ['como abordas un problema nuevo', 'process'], ['por donde empiezas un proyecto', 'process'], ['what is your design process', 'process'], ['cual es tu metodologia de trabajo', 'process'],
  // research
  ['como investigas', 'research'], ['haces entrevistas a usuarios', 'research'], ['como haces user research', 'research'], ['como descubres las necesidades del usuario', 'research'], ['how do you do user research', 'research'],
  ['como haces benchmark', 'benchmark'], ['analizas la competencia?', 'benchmark'], ['como comparas productos', 'benchmark'],
  // bocetos / prototipos / pruebas
  ['como bocetas', 'sketch'], ['haces wireframes', 'sketch'], ['como haces los flujos', 'sketch'], ['como ideas soluciones', 'sketch'], ['how do you sketch', 'sketch'],
  ['como prototipas', 'prototype'], ['haces prototipos en figma', 'prototype'], ['que nivel de fidelidad usas en prototipos', 'prototype'],
  ['como validas tus diseños', 'testing'], ['haces pruebas con usuarios', 'testing'], ['haces test de usabilidad', 'testing'], ['how do you validate', 'testing'],
  // metricas / negocio
  ['como mides el exito de un producto', 'metrics'], ['que kpis usas', 'metrics'], ['como sabes si un diseño funciono', 'metrics'], ['como mides el impacto', 'metrics'], ['how do you measure success', 'metrics'],
  ['como mides el arr', 'revenue'], ['como mides el aerr de los productos', 'revenue'], ['como calculas el roi', 'revenue'], ['como impacta el diseño en los ingresos', 'revenue'], ['como mejoras la conversion', 'revenue'], ['entiendes de negocio?', 'revenue'],
  ['como mejoras la retencion', 'adoption'], ['como logras que la gente use el producto', 'adoption'], ['como diseñas el onboarding', 'adoption'],
  ['como priorizas', 'prioritize'], ['como decides que diseñar primero', 'prioritize'], ['como manejas el roadmap', 'prioritize'],
  // sistema, ui, accesibilidad, datos, marca
  ['has hecho design systems', 'design-system'], ['como armas un sistema de diseño', 'design-system'], ['manejas tokens', 'design-system'],
  ['como cuidas lo visual', 'ui'], ['que tan bueno eres en ui', 'ui'], ['te gusta la animacion', 'ui'],
  ['tienes en cuenta la accesibilidad', 'accessibility'], ['diseñas para personas con discapacidad', 'accessibility'],
  ['has diseñado dashboards', 'data-viz'], ['como visualizas datos', 'data-viz'],
  ['como haces logos', 'branding'], ['en que proyeco y como haces la bocetación de logos', 'branding'], ['diseñas marcas', 'branding'], ['hiciste el logo de barberlytics?', 'branding'], ['hokla como bocetas logos y en que proyecto has boceta y que herrmientas usas par abocetarlos', 'branding'], ['que herramientas usas para hacer logos', 'branding'], ['como diseñaste el orbe', 'branding'],
  // IA
  ['como usas la ia', 'ai'], ['como usas la IA en tu proceso', 'ai'], ['que opinas de la inteligencia artificial', 'ai'], ['usas chatgpt', 'ai'],
  ['como diseñas agentes de ia', 'ai-agents'], ['como evitas que la ia alucine', 'ai-agents'], ['como diseñaste clipper', 'ai-agents'], ['que es rumbo', 'ai-agents'],
  // casos
  ['cuentame de barberlytics', 'barberlytics'], ['que es barberlytics', 'barberlytics'], ['como funciona la reserva', 'barberlytics'], ['hablame del calendario', 'barberlytics'],
  ['cuentame de objetivos', 'objetivos'], ['como funcionan los okrs en ubits', 'objetivos'],
  ['que es sellup', 'sellup'], ['cuentame de sell up', 'sellup'], ['como funciona la prospeccion', 'sellup'],
  ['cuentame de encuestas', 'encuestas'], ['como cuidas el anonimato', 'encuestas'],
  ['cual es tu proyecto favorito', 'projects'], ['que proyectos tienes', 'projects'], ['muestrame tu portafolio', 'projects'],
  // equipo y persona
  ['como trabajas con desarrolladores', 'team'], ['como es tu relacion con los pm', 'team'], ['como haces el handoff', 'team'],
  ['que haces cuando no estas de acuerdo', 'stakeholders'], ['como manejas el feedback negativo', 'stakeholders'], ['como convences a un stakeholder', 'stakeholders'],
  ['usas scrum', 'methodologies'], ['trabajas con agile', 'methodologies'], ['conoces design thinking', 'methodologies'],
  ['cuales son tus fortalezas', 'strengths'], ['cual es tu debilidad', 'strengths'], ['que habilidades tienes', 'strengths'],
  ['cual ha sido tu mayor error', 'learning'], ['que aprendiste en tus proyectos', 'learning'],
  ['cuanta experiencia tienes', 'experience'], ['donde has trabajado', 'experience'], ['trabajaste en siigo?', 'experience'], ['cuantos años llevas', 'experience'],
  ['que herramientas usas', 'tools'], ['usas figma', 'tools'], ['cual es tu stack', 'tools'],
  ['que estudiaste', 'education'], ['tienes certificaciones', 'education'],
  ['por que deberiamos contratarte', 'hire'], ['que te diferencia de otros diseñadores', 'hire'], ['que valor aportas', 'hire'],
  ['cuanto cobras', 'money'], ['cual es tu aspiracion salarial', 'money'],
  ['como te contacto', 'contact'], ['tienes linkedin', 'contact'], ['estas disponible?', 'contact'], ['trabajas remoto', 'contact'],
  ['me pasas tu hoja de vida', 'cv'], ['tienes cv', 'cv'],
  ['que te gusta de tu trabajo', 'motivation'], ['que te motiva', 'motivation'],
  ['hola', 'hello'], ['buenas tardes', 'hello'], ['gracias', 'thanks'],
  ['cual es tu comida favorita', 'personal'], ['hablas ingles', null],
  // ── Segunda tanda: compuestas, detalles de casos, temas nuevos, tipeo e inglés
  // compuestas: el tema específico manda
  ['como haces los logos y que herramientas usas', 'branding'], ['que herramientas usas para bocetar', 'sketch'], ['como mides el impacto de la ia', 'metrics'],
  ['como usas la ia para investigar', 'ai'], ['como diseñas un sistema de diseño y lo documentas', 'design-system'], ['como bocetas y prototipas', 'sketch'],
  ['en que proyecto usaste voz', 'voice'], ['en que proyecto hiciste gamificacion', 'gamification'], ['en que proyecto mediste el roi', 'revenue'],
  ['en que proyecto trabajaste la privacidad de los datos', 'privacy'], ['en que proyecto diseñaste para celular', 'mobile'],
  // detalles de casos
  ['como funciona clipper por voz', 'voice'], ['como es la voz de clipper', 'voice'], ['que es thema', 'design-system'], ['cuantos componentes tiene thema', 'design-system'],
  ['que es lo de siempre en la reserva', 'barberlytics'], ['como reacomoda el calendario cuando alguien llega tarde', 'barberlytics'],
  ['como se aprueba un objetivo', 'objetivos'], ['que es la cascada de objetivos', 'objetivos'], ['que es la nom 035', 'encuestas'], ['como funciona el anonimato en encuestas', 'encuestas'],
  ['como evita sellup gastar creditos', 'sellup'], ['que hacen los agentes de sellup', 'ai-agents'], ['que es orbit', 'ai-agents'],
  ['cuantas evaluaciones tiene clipper', 'ai-agents'], ['como evitas que clipper invente cifras', 'ai-agents'],
  // nuevos temas
  ['diseñas apps moviles', 'mobile'], ['tienes experiencia en responsive', 'mobile'], ['como organizas la informacion', 'ia-architecture'], ['como haces la arquitectura de informacion', 'ia-architecture'],
  ['como escribes los textos de la interfaz', 'ux-writing'], ['te importa el microcopy', 'ux-writing'], ['usas gamificacion', 'gamification'], ['como motivas a los usuarios con rachas', 'gamification'],
  ['como cuidas la privacidad', 'privacy'], ['como manejas datos sensibles', 'privacy'], ['has liderado equipos', 'leadership'], ['eres lead', 'leadership'],
  ['documentas tus diseños', 'documentation'], ['como haces las especificaciones para desarrollo', 'documentation'],
  ['tienes experiencia en b2b', 'b2b'], ['has trabajado en saas', 'b2b'], ['conoces de recursos humanos', 'b2b'], ['trabajaste en nomina', 'b2b'],
  // tipeo y coloquial
  ['q herramientas usas', 'tools'], ['cmo mides el exito', 'metrics'], ['cuentame d barberlitics', 'barberlytics'], ['como aces prototipos', 'prototype'], ['k es sellup', 'sellup'],
  ['hablame de tu esperiencia', 'experience'], ['cual es tu procesp', 'process'], ['diseñas logotipos?', 'branding'], ['como investigas a los usarios', 'research'],
  ['tienes portafolio?', 'projects'], ['ola', 'hello'], ['muchas grasias', 'thanks'],
  // ingles
  ['how do you sketch logos', 'branding'], ['what tools do you use', 'tools'], ['tell me about sellup', 'sellup'], ['how do you work with developers', 'team'],
  ['do you design design systems', 'design-system'], ['how do you prioritize', 'prioritize'], ['what is your biggest weakness', 'strengths'], ['how much do you charge', 'money'],
  ['can I see your resume', 'cv'], ['where are you based', 'contact'], ['do you lead teams', 'leadership'], ['how do you handle privacy', 'privacy'],
  // fuera de tema
  ['cual es tu equipo de futbol', 'personal'], ['que edad tienes', 'personal'],
]
let fail = 0
for (const [q, want] of cases) {
  const got = routeTopic(q)
  if (got !== want) { fail++; console.log(`✕ «${q}» → ${got} (esperado ${want})`) }
}
console.log(`${cases.length - fail}/${cases.length} correctas`)
if (fail) process.exit(1)
