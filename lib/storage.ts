/**
 * Acceso seguro a localStorage: en modo privado o con almacenamiento
 * bloqueado puede lanzar, así que cualquier fallo devuelve null / se ignora.
 */
export function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Almacenamiento no disponible: la preferencia vive solo en esta visita.
  }
}

export function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeSession(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Ignorado a propósito (ver arriba).
  }
}
