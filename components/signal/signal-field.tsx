'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { fragmentShader, vertexShader } from './shaders'
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
const DEFAULT_PARTICLES = { desktop: 9000, mobile: 3800 }

const GLYPH_WORLD_WIDTH = 8
const CAMERA_Z = 10
const FOV = 35
/** Margen alrededor del trazo de las letras que también cuenta como hover */
const HIT_PADDING = 0.06
/** Desde qué progreso el EG cuenta como "formado" para el hover */
const HOVER_MIN_PROGRESS = 0.8
const HOVER_EASE = 0.1

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
        return
      }
      // Coordenadas locales del grupo (descuenta su escala y desplazamiento vertical).
      const x = (nx * view.width) / 2 / groupScale
      const y = ((ny * view.height) / 2 - group.position.y) / groupScale
      const formed = (reducedMotion ? 1 : progress.current) > HOVER_MIN_PROGRESS
      // Solo cuenta si el cursor está sobre el trazo de las letras, no sobre el fondo.
      setHovering(formed && glyph !== null && glyph.contains(x, y, HIT_PADDING))
    }
    const onLeave = () => setHovering(false)

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
      const noise = new Float32Array(count * 3)
      const rand = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        noise[i * 3] = (Math.random() - 0.5) * view.width * 1.3 / groupScale
        noise[i * 3 + 1] = (Math.random() - 0.5) * view.height * 1.3 / groupScale
        noise[i * 3 + 2] = (Math.random() - 0.5) * 6
        rand[i] = Math.random()
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(sample.points.slice(), 3))
      geometry.setAttribute('aTarget', new THREE.BufferAttribute(sample.points, 3))
      geometry.setAttribute('aNoise', new THREE.BufferAttribute(noise, 3))
      geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
      geometry.setAttribute('aBright', new THREE.BufferAttribute(sample.brightness ?? new Float32Array(count).fill(1), 1))
      geometry.setAttribute('aRim', new THREE.BufferAttribute(sample.rim ?? new Float32Array(count), 1))
      uniforms.uHalfHeight.value = sample.height / 2
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
      renderer.dispose()
      renderer.domElement.remove()
    }
    // Las opciones de figura se fijan al montar; no se recrea la escena por ellas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, reducedMotion])

  return <div ref={containerRef} className={className} />
}
