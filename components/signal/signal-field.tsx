'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { fragmentShader, vertexShader } from './shaders'
import { sampleGlyph } from './sample-glyph'

interface SignalFieldProps {
  /** Progreso 0–1 (ruido → señal); lo escribe el scroll del hero */
  progress: React.MutableRefObject<number>
  reducedMotion: boolean
  className?: string
}

const GLYPH_WORLD_WIDTH = 8
const CAMERA_Z = 10
const FOV = 35

function particleCount(): number {
  const small = window.innerWidth < 768
  return small ? 3800 : 9000
}

function visibleSize(aspect: number) {
  const height = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  return { width: height * aspect, height }
}

/**
 * Escena WebGL del hero: miles de partículas de estática que se ordenan
 * en el monograma EG a medida que el usuario hace scroll.
 */
export function SignalField({ progress, reducedMotion, className }: SignalFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)

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

    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: window.innerWidth < 768 ? 2.2 : 3.2 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uNoiseColor: { value: new THREE.Color('#8a8d93') },
      uSignalColor: { value: new THREE.Color('#f1f0ec') },
      uAccent: { value: new THREE.Color('#4060ff') },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    })
    const geometry = new THREE.BufferGeometry()
    let points: THREE.Points | null = null
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
      groupScale = Math.min(1, (view.width * 0.86) / GLYPH_WORLD_WIDTH)
      group.scale.setScalar(groupScale)
      // El monograma queda en el tercio superior: deja aire a la firma de abajo.
      group.position.y = view.height * 0.1
    }

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1
      // Coordenadas locales del grupo (descuenta su escala y desplazamiento vertical).
      uniforms.uMouse.value.set(
        (nx * view.width) / 2 / groupScale,
        ((ny * view.height) / 2 - group.position.y) / groupScale,
      )
    }
    const onLeave = () => uniforms.uMouse.value.set(99, 99)

    const clock = new THREE.Clock()
    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime()
      uniforms.uProgress.value = reducedMotion ? 1 : progress.current
      // Leve giro de la escena según el progreso: sensación de profundidad.
      group.rotation.y = (1 - uniforms.uProgress.value) * 0.35
      group.rotation.x = (1 - uniforms.uProgress.value) * -0.12
      renderer.render(scene, camera)
    }
    const loop = () => {
      if (disposed) return
      if (visible) render()
      frame = requestAnimationFrame(loop)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(container)

    const init = async () => {
      const count = particleCount()
      const glyph = await sampleGlyph('EG', count, GLYPH_WORLD_WIDTH)
      if (disposed) return
      resize()
      const noise = new Float32Array(count * 3)
      const rand = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        noise[i * 3] = (Math.random() - 0.5) * view.width * 1.3 / groupScale
        noise[i * 3 + 1] = (Math.random() - 0.5) * view.height * 1.3 / groupScale
        noise[i * 3 + 2] = (Math.random() - 0.5) * 6
        rand[i] = Math.random()
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(glyph.points.slice(), 3))
      geometry.setAttribute('aTarget', new THREE.BufferAttribute(glyph.points, 3))
      geometry.setAttribute('aNoise', new THREE.BufferAttribute(noise, 3))
      geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
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
  }, [progress, reducedMotion])

  return <div ref={containerRef} className={className} />
}
