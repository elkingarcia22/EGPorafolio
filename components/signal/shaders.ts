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
  varying float vNoise;

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

    // Microinteracción: cerca del cursor la señal vuelve a ser ruido.
    // Las partículas vibran en su sitio (temblor de alta frecuencia),
    // sin desplazarse: como interferencia en una antena.
    float dist = length(pos.xy - uMouse);
    float force = smoothstep(1.3, 0.0, dist) * t;
    float tick = floor(uTime * 40.0);
    vec3 shake = vec3(
      fract(sin(aRand * 127.1 + tick * 1.7) * 43758.5453) - 0.5,
      fract(sin(aRand * 311.7 + tick * 2.3) * 43758.5453) - 0.5,
      fract(sin(aRand * 74.7 + tick * 3.1) * 43758.5453) - 0.5
    );
    pos += shake * force * vec3(0.32, 0.32, 0.8);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 + (1.0 - t) * aRand * 1.4 + force * aRand) * (10.0 / -mv.z);

    vMix = t;
    vRand = aRand;
    vNoise = force;
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

  void main() {
    // Parpadeo de estática mientras es ruido (y donde el cursor interfiere).
    float flicker = step(0.45, fract(sin(vRand * 913.0 + floor(uTime * 18.0)) * 43758.5453));
    float fastFlicker = step(0.5, fract(sin(vRand * 531.0 + floor(uTime * 40.0)) * 43758.5453));
    float alpha = mix(0.25 + 0.55 * flicker, 0.95, vMix);
    alpha = mix(alpha, 0.3 + 0.7 * fastFlicker, vNoise);
    vec3 color = mix(uNoiseColor, uSignalColor, vMix);
    // Unas pocas partículas toman el color de la señal.
    color = mix(color, uAccent, step(0.94, vRand) * vMix);
    // Interferencia: vuelve al gris de la estática con chispas de color.
    color = mix(color, uNoiseColor, vNoise * 0.7);
    color = mix(color, uAccent, vNoise * step(0.8, vRand));
    gl_FragColor = vec4(color, alpha);
  }
`
