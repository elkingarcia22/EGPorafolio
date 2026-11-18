/**
 * Retrato como nube de puntos 3D, en la estética de un escaneo:
 * azul profundo, bordes iluminados con aberración cromática (verde/rojo),
 * niebla con la profundidad y desvanecido hacia los hombros.
 * Comparte la lógica ruido → forma y la vibración del hover con el EG.
 */
export const portraitVertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aNoise;
  attribute float aRand;
  attribute float aBright;
  attribute float aRim;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uHover;
  uniform float uHalfHeight;

  varying float vMix;
  varying float vRand;
  varying float vNoise;
  varying float vBright;
  varying float vRim;
  varying float vDepth;
  varying float vBottom;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    float t = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
    t = easeInOutCubic(t);

    vec3 drift = vec3(
      sin(uTime * 0.3 + aRand * 6.2831),
      cos(uTime * 0.25 + aRand * 3.1415),
      sin(uTime * 0.2 + aRand * 12.0)
    ) * 0.35;
    vec3 pos = mix(aNoise + drift, aTarget, t);

    // Respiración: un temblor mínimo, como un escaneo vivo.
    pos += vec3(0.0, 0.0, sin(uTime * 1.2 + aTarget.y * 2.0) * 0.03) * t;

    // Hover: todo el retrato entra en interferencia.
    float force = uHover * t * (0.55 + 0.45 * aRand);
    float tick = floor(uTime * 40.0);
    vec3 shake = vec3(
      fract(sin(aRand * 127.1 + tick * 1.7) * 43758.5453) - 0.5,
      fract(sin(aRand * 311.7 + tick * 2.3) * 43758.5453) - 0.5,
      fract(sin(aRand * 74.7 + tick * 3.1) * 43758.5453) - 0.5
    );
    pos += shake * force * vec3(0.18, 0.18, 0.6);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.6 + 0.5 * aBright + 1.0 * aRim);
    gl_PointSize = size * uPixelRatio * (10.0 / -mv.z) * (1.0 + (1.0 - t) * aRand);

    vMix = t;
    vRand = aRand;
    vNoise = force;
    vBright = aBright;
    vRim = aRim;
    vDepth = -mv.z;
    // 0 en la base del retrato, 1 a partir de un tercio de altura.
    vBottom = smoothstep(-uHalfHeight, -uHalfHeight * 0.25, aTarget.y);
  }
`

export const portraitFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uHighlight;
  uniform vec3 uFringeA;
  uniform vec3 uFringeB;
  uniform vec3 uNoiseColor;
  uniform float uCameraZ;

  varying float vMix;
  varying float vRand;
  varying float vNoise;
  varying float vBright;
  varying float vRim;
  varying float vDepth;
  varying float vBottom;

  void main() {
    // Punto redondo y suave.
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.1, d);

    vec3 color = mix(uBase * (0.45 + 0.55 * vBright), uHighlight, pow(vBright, 2.2) * 0.45);
    // Bordes iluminados: blanco azulado con franjas verdes y rojas.
    float fringe = step(0.72, vRand) * vRim;
    vec3 fringeColor = vRand > 0.88 ? uFringeB : uFringeA;
    color = mix(color, uHighlight, vRim * 0.8);
    color = mix(color, fringeColor, fringe * 0.85);
    // Mientras es ruido, gris de estática.
    color = mix(uNoiseColor, color, vMix);
    color = mix(color, uNoiseColor, vNoise * 0.4);

    // Niebla: lo que está más lejos de la cámara se apaga.
    float fog = smoothstep(uCameraZ + 3.0, uCameraZ - 1.5, vDepth);
    float alpha = soft * (0.35 + 0.65 * fog) * mix(0.55, 1.0, vMix);
    alpha *= mix(1.0, vBottom, vMix);
    alpha *= (0.3 + 0.5 * vBright + 0.5 * vRim) * 0.75;

    gl_FragColor = vec4(color, alpha);
  }
`
