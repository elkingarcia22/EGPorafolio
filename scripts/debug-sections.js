// Script para debuggear las secciones de la página
// Ejecutar en la consola del navegador

console.log('🔍 Debug de secciones de la página...')

const sections = ['home', 'proyectos', 'acerca', 'contacto']

sections.forEach(sectionId => {
  const element = document.getElementById(sectionId)
  if (element) {
    const rect = element.getBoundingClientRect()
    console.log(`✅ ${sectionId}:`, {
      found: true,
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height,
      width: rect.width,
      isVisible: rect.top <= 100 && rect.bottom >= 0
    })
  } else {
    console.error(`❌ ${sectionId}: No encontrado`)
  }
})

// Verificar si estamos en la página correcta
console.log('📍 URL actual:', window.location.href)
console.log('📍 Pathname:', window.location.pathname)

// Función para probar el scroll spy manualmente
window.testScrollSpy = function() {
  console.log('🧪 Probando scroll spy...')
  
  const sections = ['home', 'proyectos', 'acerca', 'contacto']
  let currentSection = 'home'
  let maxVisibleArea = 0

  sections.forEach(sectionId => {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementBottom = rect.bottom
      const viewportHeight = window.innerHeight
      
      // Calcular el área visible de la sección
      const visibleTop = Math.max(0, elementTop)
      const visibleBottom = Math.min(viewportHeight, elementBottom)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)
      const visibleArea = visibleHeight * rect.width
      const visibilityPercentage = visibleHeight / rect.height
      
      console.log(`🔍 ${sectionId}:`, {
        top: elementTop,
        bottom: elementBottom,
        height: rect.height,
        viewportHeight,
        visibleHeight,
        visibleArea,
        percentage: (visibilityPercentage * 100).toFixed(1) + '%'
      })
      
      // Una sección está activa si tiene la mayor área visible
      // Umbral dinámico basado en el tamaño de pantalla
      const isLargeScreen = viewportHeight > 800
      const minThreshold = isLargeScreen ? 0.1 : 0.2 // 10% en pantallas grandes, 20% en pequeñas
      
      // También considerar secciones que están principalmente en el viewport
      const isMainlyVisible = elementTop <= viewportHeight * 0.3 && elementBottom >= viewportHeight * 0.1
      
      if ((visibilityPercentage >= minThreshold || isMainlyVisible) && visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea
        currentSection = sectionId
      }
    }
  })

  console.log(`🎯 Sección activa debería ser: ${currentSection} (área visible: ${maxVisibleArea.toFixed(0)})`)
  return currentSection
}

console.log('💡 Usa testScrollSpy() para probar manualmente')
