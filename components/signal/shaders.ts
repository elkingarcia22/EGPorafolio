/**
 * Monograma como red: cada punto vive entre una posición de "ruido"
 * (aleatoria) y una de "señal" (un punto del EG). Algunos puntos son
 * nodos (más grandes) y se unen con líneas por las que viajan pulsos.
 * uProgress 0 → estática, 1 → monograma formado.
 */

/** Posición compartida por partículas y líneas: así las líneas siguen a sus nodos. */
const POSITION_CHUNK = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aNoise;
  attribute float aRand;

  uniform float uProgress;
  uniform float uTime;
  /** Cursor en coordenadas locales del monograma (lejos = sin efecto) */
  uniform vec2 uMouse;

  const float CURSOR_RADIUS = 1.5;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  /** Devuelve la posición; escribe en t el avance (0–1) y en force la cercanía al cursor. */
  vec3 signalPosition(out float t, out float force) {
    // Cada punto llega con un retraso distinto: la señal "se arma".
    t = easeInOutCubic(clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0));

    vec3 drift = vec3(
      sin(uTime * 0.35 + aRand * 6.2831) * 0.35,
      cos(uTime * 0.28 + aRand * 3.1415) * 0.35,
      0.0
    );
    vec3 jitter = vec3(sin(uTime * 9.0 + aRand * 50.0), cos(uTime * 8.0 + aRand * 80.0), 0.0) * 0.04;
    vec3 pos = mix(aNoise + drift + jitter, aTarget, t);

    // Respiración sutil cuando la señal ya está formada.
    pos.z += sin(uTime * 1.4 + aTarget.x * 1.3 + aTarget.y) * 0.05 * t;

    // Hover como en Contacto: los nodos y conexiones cercanos al cursor se
    // encienden; nada se mueve de su sitio.
    force = smoothstep(CURSOR_RADIUS, 0.0, distance(aTarget.xy, uMouse)) * t;
    return pos;
  }
`

export const vertexShader = /* glsl */ `
  ${POSITION_CHUNK}
  /** 1 = nodo de la red (más grande y nítido), 0 = partícula de relleno */
  attribute float aNode;

  uniform float uSize;
  uniform float uPixelRatio;

  varying float vMix;
  varying float vRand;
  varying float vNoise;
  varying float vNode;

  void main() {
    float t;
    float force;
    vec3 pos = signalPosition(t, force);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // Ya formado: los nodos crecen y el relleno se hace más fino.
    float formed = mix(1.0, mix(0.55, 1.35, aNode), t);
    gl_PointSize = uSize * uPixelRatio * formed * (1.0 + (1.0 - t) * aRand * 1.4 + force * (0.4 + 0.9 * aNode)) * (10.0 / -mv.z);

    vMix = t;
    vRand = aRand;
    vNoise = force;
    vNode = aNode;
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3 uNoiseColor;
  uniform vec3 uSignalColor;
  uniform vec3 uAccent;
  uniform float uTime;

  varying float vMix;
  varying float vRand;
  varying float vNoise;
  varying float vNode;

  void main() {
    // Parpadeo de estática mientras es ruido (y donde el cursor interfiere).
    float flicker = step(0.45, fract(sin(vRand * 913.0 + floor(uTime * 18.0)) * 43758.5453));
    float alpha = mix(0.25 + 0.55 * flicker, mix(0.22, 1.0, vNode), vMix);
    vec3 color = mix(uNoiseColor, uSignalColor, vMix);
    // Algunos nodos toman el color de la señal.
    color = mix(color, uAccent, step(0.9, vRand) * vNode * vMix);
    // Cerca del cursor: se encienden en azul.
    color = mix(color, uAccent, vNoise);
    alpha = max(alpha, vNoise * mix(0.5, 1.0, vNode));
    gl_FragColor = vec4(color, alpha);
  }
`

/** Líneas entre nodos: aparecen al formarse la red y llevan pulsos azules. */
export const lineVertexShader = /* glsl */ `
  ${POSITION_CHUNK}
  /** 0 en un extremo de la línea, 1 en el otro */
  attribute float aSide;
  /** Semilla por línea (igual en sus dos extremos) */
  attribute float aSeed;

  varying float vMix;
  varying float vSide;
  varying float vSeed;
  varying float vNoise;

  void main() {
    float t;
    float force;
    vec3 pos = signalPosition(t, force);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vMix = t;
    vSide = aSide;
    vSeed = aSeed;
    vNoise = force;
  }
`

export const lineFragmentShader = /* glsl */ `
  uniform vec3 uSignalColor;
  uniform vec3 uAccent;
  uniform float uTime;

  varying float vMix;
  varying float vSide;
  varying float vSeed;
  varying float vNoise;

  void main() {
    // Las conexiones solo existen cuando ambos nodos ya llegaron.
    float linked = smoothstep(0.75, 1.0, vMix);
    // Pulso: un punto de luz que recorre algunas líneas, cada una a su ritmo.
    float lit = step(0.5, fract(vSeed * 91.7));
    // La semilla sigue la posición horizontal: los pulsos cruzan el EG en ondas.
    float head = fract(uTime * 0.45 - vSeed * 3.0 + vSide * 0.0);
    head = fract(head + fract(vSeed * 41.0) * 0.15);
    float pulse = smoothstep(0.16, 0.0, abs(vSide - head)) * lit;

    vec3 color = mix(uSignalColor, uAccent, max(pulse, vNoise));
    float alpha = (0.34 + 0.66 * pulse + 0.5 * vNoise) * linked;
    gl_FragColor = vec4(color, alpha);
  }
`
