/**
 * Partículas: cada una vive entre una posición de "ruido" (aleatoria)
 * y una posición de "señal" (un punto del monograma EG).
 * uProgress 0 → estática, 1 → monograma formado.
 */
export const vertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aNoise;
  attribute float aRand;
  attribute float aBright;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uHover;
  uniform float uHalfHeight;
  uniform float uFadeBottom;

  varying float vMix;
  varying float vRand;
  varying float vNoise;
  varying float vBright;
  varying float vFade;

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

    // Microinteracción: con el cursor sobre el EG, todo el monograma
    // entra en interferencia. Las partículas vibran en su sitio (temblor
    // de alta frecuencia) sin perder la forma, con intensidad variable.
    float force = uHover * t * (0.55 + 0.45 * aRand);
    float tick = floor(uTime * 40.0);
    vec3 shake = vec3(
      fract(sin(aRand * 127.1 + tick * 1.7) * 43758.5453) - 0.5,
      fract(sin(aRand * 311.7 + tick * 2.3) * 43758.5453) - 0.5,
      fract(sin(aRand * 74.7 + tick * 3.1) * 43758.5453) - 0.5
    );
    pos += shake * force * vec3(0.2, 0.2, 0.7);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // En retratos el tamaño sigue al brillo de la foto (efecto semitono).
    float tone = mix(1.0, 0.35 + 0.9 * aBright, t);
    gl_PointSize = uSize * uPixelRatio * tone * (1.0 + (1.0 - t) * aRand * 1.4 + force * aRand) * (10.0 / -mv.z);

    vMix = t;
    vRand = aRand;
    vNoise = force;
    vBright = aBright;
    // Retrato: la base (hombros) se desvanece en vez de cortarse.
    float bottom = smoothstep(-uHalfHeight, -uHalfHeight * 0.3, aTarget.y);
    vFade = mix(1.0, bottom, uFadeBottom * t);
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
  varying float vBright;
  varying float vFade;

  void main() {
    // Parpadeo de estática mientras es ruido (y donde el cursor interfiere).
    float flicker = step(0.45, fract(sin(vRand * 913.0 + floor(uTime * 18.0)) * 43758.5453));
    float fastFlicker = step(0.5, fract(sin(vRand * 531.0 + floor(uTime * 40.0)) * 43758.5453));
    float alpha = mix(0.25 + 0.55 * flicker, 0.95, vMix);
    alpha = mix(alpha, 0.3 + 0.7 * fastFlicker, vNoise);
    vec3 color = mix(uNoiseColor, uSignalColor * (0.4 + 0.6 * vBright), vMix);
    // Unas pocas partículas toman el color de la señal.
    color = mix(color, uAccent, step(0.94, vRand) * vMix);
    // Interferencia: vuelve al gris de la estática con chispas de color.
    color = mix(color, uNoiseColor, vNoise * 0.5);
    color = mix(color, uAccent, vNoise * step(0.8, vRand));
    gl_FragColor = vec4(color, alpha * vFade);
  }
`
