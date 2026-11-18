'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { fragmentShader, lineFragmentShader, lineVertexShader, vertexShader } from './shaders'
import { sampleGlyph, type ShapeSample } from './sample-glyph'

/** Función que devuelve la figura a formar con `count` partículas. */
export type ShapeLoader = (count: number, worldWidth: number) => Promise<ShapeSample>

interface SignalFieldProps {
  /** Progreso 0–1 (ruido → señal); lo escribe el scroll */
  progress: React.MutableRefObject<number>
  reducedMotion: boolean
  className?: string
  /** Avisa cuando el cursor entra o sale de la figura ya formada */
  onHoverChange?: (hovering: boolean) => void
  /** Figura a formar (por defecto, el monograma EG) */
  shape?: ShapeLoader
  /** Desplazamiento vertical de la figura, en fracción del alto visible */
  offsetY?: number
  /** Partículas en escritorio / móvil */
  particles?: { desktop: number; mobile: number }
  /** Ocupación máxima del alto visible (0–1) */
  fitHeight?: number
  /** "signal" (EG) o "portrait": mismo estilo, con giro suave, parallax y base desvanecida */
  look?: 'signal' | 'portrait'
}

const loadGlyph: ShapeLoader = (count, worldWidth) => sampleGlyph('EG', count, worldWidth)
const DEFAULT_PARTICLES = { desktop: 3600, mobile: 1800 }

const GLYPH_WORLD_WIDTH = 8
const CAMERA_Z = 10
const FOV = 35
/** Margen alrededor del trazo de las letras que también cuenta como hover */
const HIT_PADDING = 0.06
/** Desde qué progreso el EG cuenta como "formado" para el hover */
const HOVER_MIN_PROGRESS = 0.8
const HOVER_EASE = 0.1
/** Nodos de la red (escritorio / móvil) y reglas de conexión */
/** Separación entre nodos de la malla, en unidades del monograma */
const LATTICE_SPACING = { desktop: 0.2, mobile: 0.28 }
/** Desorden de cada nodo respecto a la malla (fracción de la separación) */
const LATTICE_JITTER = 0.42
/** Proporción de nodos y de conexiones que se omiten: red orgánica, no cuadrícula */
const NODE_DROP = 0.1
/** Cada nodo se une con sus vecinos más cercanos (hasta este número) */
const LINKS_PER_NODE = 3
/** Distancia máxima de una conexión, en separaciones de malla */
const LINK_REACH = 2.4

function particleCount(particles: { desktop: number; mobile: number }): number {
  return window.innerWidth < 768 ? particles.mobile : particles.desktop
}

function visibleSize(aspect: number) {
  const height = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  return { width: height * aspect, height }
}

/**
 * Escena WebGL: miles de partículas de estática que se ordenan en una
 * figura (el monograma EG, un retrato…) a medida que el usuario hace scroll.
 */
export function SignalField({
  progress,
  reducedMotion,
  className,
  onHoverChange,
  shape = loadGlyph,
  offsetY = 0.1,
  particles = DEFAULT_PARTICLES,
  fitHeight = 1,
  look = 'signal',
}: SignalFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverCallback = useRef(onHoverChange)
  hoverCallback.current = onHoverChange

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let disposed = false
    let frame = 0
    let visible = true

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
    camera.position.z = CAMERA_Z
    const group = new THREE.Group()
    scene.add(group)

    const isPortrait = look === 'portrait'
    const small = window.innerWidth < 768
    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: isPortrait ? (small ? 1.5 : 2) : small ? 2.2 : 3.2 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uNoiseColor: { value: new THREE.Color('#8a8d93') },
      uSignalColor: { value: new THREE.Color('#f1f0ec') },
      uAccent: { value: new THREE.Color('#4060ff') },
      uHalfHeight: { value: GLYPH_WORLD_WIDTH / 2 },
      uFadeBottom: { value: isPortrait ? 1 : 0 },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    })
    // Parallax del retrato: sigue suavemente al cursor.
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
    const lineMaterial = new THREE.ShaderMaterial({
      vertexShader: lineVertexShader,
      fragmentShader: lineFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    })
    const lineGeometry = new THREE.BufferGeometry()
    const geometry = new THREE.BufferGeometry()
    let points: THREE.Points | null = null
    let glyph: ShapeSample | null = null
    let groupScale = 1
    let view = { width: 1, height: 1 }

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
      view = visibleSize(camera.aspect)
      const shapeHeight = glyph?.height ?? GLYPH_WORLD_WIDTH
      groupScale = Math.min(1, (view.width * 0.86) / GLYPH_WORLD_WIDTH, (view.height * fitHeight) / shapeHeight)
      group.scale.setScalar(groupScale)
      // En el hero la figura sube un poco: deja aire a la firma de abajo.
      group.position.y = view.height * offsetY
    }

    // Hover sobre el monograma: todo el EG entra en interferencia.
    let hoverTarget = 0
    let hovering = false
    const setHovering = (next: boolean) => {
      hoverTarget = next ? 1 : 0
      if (next !== hovering) {
        hovering = next
        hoverCallback.current?.(next)
      }
    }
    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1
      tilt.tx = Math.max(-1, Math.min(1, nx))
      tilt.ty = Math.max(-1, Math.min(1, ny))
      // Fuera de la escena (p. ej. el hero ya pasó): no hay hover.
      const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom
      if (outside || !visible) {
        setHovering(false)
        uniforms.uMouse.value.set(99, 99)
        return
      }
      // Coordenadas locales del grupo (descuenta su escala y desplazamiento vertical).
      const x = (nx * view.width) / 2 / groupScale
      const y = ((ny * view.height) / 2 - group.position.y) / groupScale
      uniforms.uMouse.value.set(x, y)
      const formed = (reducedMotion ? 1 : progress.current) > HOVER_MIN_PROGRESS
      // Solo cuenta si el cursor está sobre el trazo de las letras, no sobre el fondo.
      setHovering(formed && glyph !== null && glyph.contains(x, y, HIT_PADDING))
    }
    const onLeave = () => {
      setHovering(false)
      uniforms.uMouse.value.set(99, 99)
    }

    const clock = new THREE.Clock()
    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime()
      uniforms.uProgress.value = reducedMotion ? 1 : progress.current
      if (uniforms.uProgress.value <= HOVER_MIN_PROGRESS && hovering) setHovering(false)
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * HOVER_EASE
      // Leve giro de la escena según el progreso: sensación de profundidad.
      const unformed = 1 - uniforms.uProgress.value
      if (isPortrait) {
        // Busto: giro lento continuo + parallax con el cursor.
        tilt.x += (tilt.tx - tilt.x) * 0.05
        tilt.y += (tilt.ty - tilt.y) * 0.05
        const time = uniforms.uTime.value
        group.rotation.y = unformed * 0.5 + Math.sin(time * 0.25) * 0.1 + tilt.x * 0.18
        group.rotation.x = unformed * -0.2 - tilt.y * 0.1
      } else {
        group.rotation.y = unformed * 0.35
        group.rotation.x = unformed * -0.12
      }
      renderer.render(scene, camera)
    }
    const loop = () => {
      if (disposed) return
      if (visible) render()
      frame = requestAnimationFrame(loop)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) setHovering(false)
    })
    observer.observe(container)

    const init = async () => {
      const count = particleCount(particles)
      const sample = await shape(count, GLYPH_WORLD_WIDTH)
      if (disposed) return
      glyph = sample
      resize()
      // Red con patrón: los nodos forman una malla triangular regular dentro
      // de las letras y cada uno se une con sus vecinos de malla.
      const spacing = small ? LATTICE_SPACING.mobile : LATTICE_SPACING.desktop
      const rowHeight = spacing * 0.866
      const halfW = sample.width / 2
      const halfH = sample.height / 2
      const cols = Math.ceil(sample.width / spacing) + 1
      const rows = Math.ceil(sample.height / rowHeight) + 1
      const gridIndex = new Int32Array(cols * rows).fill(-1)
      const lattice: number[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < NODE_DROP) continue
          const baseX = -halfW + c * spacing + (r % 2 ? spacing / 2 : 0)
          const baseY = halfH - r * rowHeight
          if (lattice.length / 2 >= count || !sample.contains(baseX, baseY)) continue
          // Se desordena; si el desorden lo saca de la letra, queda en su sitio.
          const jx = baseX + (Math.random() - 0.5) * 2 * LATTICE_JITTER * spacing
          const jy = baseY + (Math.random() - 0.5) * 2 * LATTICE_JITTER * spacing
          const keep = sample.contains(jx, jy)
          const x = keep ? jx : baseX
          const y = keep ? jy : baseY
          gridIndex[r * cols + c] = lattice.length / 2
          lattice.push(x, y)
        }
      }
      const nodeCount = lattice.length / 2

      const noise = new Float32Array(count * 3)
      const rand = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        noise[i * 3] = (Math.random() - 0.5) * view.width * 1.3 / groupScale
        noise[i * 3 + 1] = (Math.random() - 0.5) * view.height * 1.3 / groupScale
        noise[i * 3 + 2] = (Math.random() - 0.5) * 6
        rand[i] = Math.random()
        if (i < nodeCount) {
          sample.points[i * 3] = lattice[i * 2]
          sample.points[i * 3 + 1] = lattice[i * 2 + 1]
          sample.points[i * 3 + 2] = 0
          // La señal se encuentra en barrido de izquierda a derecha, no al azar.
          rand[i] = Math.min(1, ((lattice[i * 2] + halfW) / sample.width) * 0.9 + Math.random() * 0.1)
        }
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(sample.points.slice(), 3))
      geometry.setAttribute('aTarget', new THREE.BufferAttribute(sample.points, 3))
      geometry.setAttribute('aNoise', new THREE.BufferAttribute(noise, 3))
      geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
      const isNode = new Float32Array(count)
      isNode.fill(1, 0, nodeCount)
      geometry.setAttribute('aNode', new THREE.BufferAttribute(isNode, 1))

      const target: number[] = []
      const noiseL: number[] = []
      const randL: number[] = []
      const side: number[] = []
      const seed: number[] = []
      const pushVertex = (i: number, s: number, lineSeed: number) => {
        target.push(sample.points[i * 3], sample.points[i * 3 + 1], sample.points[i * 3 + 2])
        noiseL.push(noise[i * 3], noise[i * 3 + 1], noise[i * 3 + 2])
        randL.push(rand[i])
        side.push(s)
        seed.push(lineSeed)
      }
      // Conexiones por cercanía: cada nodo con sus vecinos más próximos,
      // siempre por dentro del trazo (no cruza huecos ni une letras).
      const reach = spacing * LINK_REACH
      const linked = new Set<number>()
      for (let a = 0; a < nodeCount; a++) {
        const ax = lattice[a * 2]
        const ay = lattice[a * 2 + 1]
        const near: { b: number; d: number }[] = []
        for (let b = 0; b < nodeCount; b++) {
          if (b === a) continue
          const d = Math.hypot(lattice[b * 2] - ax, lattice[b * 2 + 1] - ay)
          if (d < reach) near.push({ b, d })
        }
        near.sort((p, q) => p.d - q.d)
        // Los más cercanos y, a veces, uno más lejano (conexión larga).
        const picks = near.slice(0, LINKS_PER_NODE)
        if (near.length > LINKS_PER_NODE + 2 && Math.random() < 0.35) picks.push(near[near.length - 1])
        for (const { b } of picks) {
          const key = Math.min(a, b) * nodeCount + Math.max(a, b)
          if (linked.has(key)) continue
          const bx = lattice[b * 2]
          const by = lattice[b * 2 + 1]
          const inside = [0.25, 0.5, 0.75].every((k) => sample.contains(ax + (bx - ax) * k, ay + (by - ay) * k, HIT_PADDING))
          if (!inside) continue
          linked.add(key)
          // La semilla sigue la posición: los pulsos avanzan como una onda.
          const lineSeed = (ax + halfW) / sample.width + Math.random() * 0.03
          pushVertex(a, 0, lineSeed)
          pushVertex(b, 1, lineSeed)
        }
      }
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(target, 3))
      lineGeometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(target, 3))
      lineGeometry.setAttribute('aNoise', new THREE.Float32BufferAttribute(noiseL, 3))
      lineGeometry.setAttribute('aRand', new THREE.Float32BufferAttribute(randL, 1))
      lineGeometry.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1))
      lineGeometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1))
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
      lines.frustumCulled = false
      group.add(lines)

      points = new THREE.Points(geometry, material)
      points.frustumCulled = false
      group.add(points)
      if (reducedMotion) render()
      else loop()
    }

    init().catch(() => {
      // Sin WebGL/canvas el hero sigue funcionando con su tipografía.
      container.dataset.fallback = 'true'
    })

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer)
    container.addEventListener('pointerleave', onLeave)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      container.removeEventListener('pointerleave', onLeave)
      geometry.dispose()
      material.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
    // Las opciones de figura se fijan al montar; no se recrea la escena por ellas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, reducedMotion])

  return <div ref={containerRef} className={className} />
}
