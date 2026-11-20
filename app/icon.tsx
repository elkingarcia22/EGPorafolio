import { ImageResponse } from 'next/og'

/** Favicon: el monograma EG sobre el fondo oscuro del sitio. */
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export function EgMark({ px }: { px: number }) {
  const u = px / 64
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(10 11 13)', borderRadius: 14 * u }}>
      <div style={{ display: 'flex', color: 'rgb(241 240 236)', fontSize: 32 * u, fontWeight: 700, letterSpacing: -1.5 * u, marginTop: 1 * u }}>EG</div>
    </div>
  )
}

export default function Icon() {
  return new ImageResponse(<EgMark px={64} />, size)
}
