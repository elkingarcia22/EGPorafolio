/**
 * Dibuja la línea del osciloscopio para un progreso 0–1:
 * 0    → ruido puro (picos aleatorios)
 * ~0.6 → aparece una onda limpia mezclada con ruido
 * 1    → línea recta: la señal encontrada
 */
export function drawOscilloscope(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  time: number,
  colors: { line: string; accent: string },
): void {
  ctx.clearRect(0, 0, width, height)
  const mid = height / 2
  const noiseAmp = height * 0.42 * Math.pow(1 - progress, 1.6)
  const waveAmp = height * 0.16 * Math.sin(Math.PI * Math.min(1, progress * 1.15))
  const step = Math.max(2, Math.round(width / 320))

  ctx.beginPath()
  for (let x = 0; x <= width; x += step) {
    const u = x / width
    // Ventana: los extremos tiemblan menos, como una señal centrada.
    const window = Math.sin(Math.PI * u)
    const noise = (Math.random() - 0.5) * 2 * noiseAmp * window
    const wave = Math.sin(u * Math.PI * 12 - time * 4) * waveAmp * window
    const y = mid + noise + wave
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.lineWidth = 1 + progress * 2
  ctx.strokeStyle = progress > 0.92 ? colors.accent : colors.line
  ctx.lineJoin = 'round'
  ctx.stroke()

  // Puntos de estática sueltos alrededor, se apagan con el progreso.
  const dots = Math.floor(160 * (1 - progress))
  ctx.fillStyle = colors.line
  for (let i = 0; i < dots; i++) {
    const s = Math.random() < 0.85 ? 1.5 : 3
    ctx.globalAlpha = Math.random() * 0.5
    ctx.fillRect(Math.random() * width, mid + (Math.random() - 0.5) * height, s, s)
  }
  ctx.globalAlpha = 1
}
