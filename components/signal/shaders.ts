/**
 * Partículas: cada una vive entre una posición de "ruido" (aleatoria)
 * y una posición de "señal" (un punto del monograma EG).
 * uProgress 0 → estática, 1 → monograma formado.
 */
export const vertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aNoise;
  attribute float aRand;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uMouse;

  varying float vMix;
  varying float vRand;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    // Cada partícula llega con un retraso distinto: la señal "se arma".
    float t = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
    t = easeInOutCubic(t);

    vec3 drift = vec3(
      sin(uTime * 0.35 + aRand * 6.2831) * 0.35,
      cos(uTime * 0.28 + aRand * 3.1415) * 0.35,
      0.0
    );
    vec3 jitter = vec3(
      sin(uTime * 9.0 + aRand * 50.0),
      cos(uTime * 8.0 + aRand * 80.0),
      0.0
    ) * 0.04;

    vec3 pos = mix(aNoise + drift + jitter, aTarget, t);

    // Respiración sutil cuando la señal ya está formada.
    pos.z += sin(uTime * 1.4 + aTarget.x * 1.3 + aTarget.y) * 0.05 * t;

    // Microinteracción: el cursor desplaza las partículas (interferencia).
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    float force = smoothstep(1.1, 0.0, dist) * t;
    pos.xy += normalize(d + 0.0001) * force * 0.45;
    pos.z += force * 0.6;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 + (1.0 - t) * aRand * 1.4) * (10.0 / -mv.z);

    vMix = t;
    vRand = aRand;
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3 uNoiseColor;
  uniform vec3 uSignalColor;
  uniform vec3 uAccent;
  uniform float uTime;

  varying float vMix;
  varying float vRand;

  void main() {
    // Parpadeo de estática mientras es ruido.
    float flicker = step(0.45, fract(sin(vRand * 913.0 + floor(uTime * 18.0)) * 43758.5453));
    float alpha = mix(0.25 + 0.55 * flicker, 0.95, vMix);
    vec3 color = mix(uNoiseColor, uSignalColor, vMix);
    // Unas pocas partículas toman el color de la señal.
    color = mix(color, uAccent, step(0.94, vRand) * vMix);
    gl_FragColor = vec4(color, alpha);
  }
`
