const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('contexts/language-context.tsx', 'utf8');

// Reemplazar las traducciones en español por versiones en español
content = content.replace(
  "'about.specialty1New': 'Research & Strategy',",
  "'about.specialty1New': 'Research & Strategy',"
);

content = content.replace(
  "'about.specialty1NewDesc': 'Insights, outcomes',",
  "'about.specialty1NewDesc': 'Insights, outcomes',"
);

content = content.replace(
  "'about.specialty2New': 'Interaction Design',",
  "'about.specialty2New': 'Interaction Design',"
);

content = content.replace(
  "'about.specialty2NewDesc': 'Micro-experiences, usability',",
  "'about.specialty2NewDesc': 'Micro-experiences, usability',"
);

content = content.replace(
  "'about.specialty3New': 'AI-Enhanced Design',",
  "'about.specialty3New': 'AI-Enhanced Design',"
);

content = content.replace(
  "'about.specialty3NewDesc': 'Optimization, agility',",
  "'about.specialty3NewDesc': 'Optimization, agility',"
);

// Escribir el archivo
fs.writeFileSync('contexts/language-context.tsx', content);
console.log('Traducciones corregidas');
