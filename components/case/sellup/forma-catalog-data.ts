/**
 * Catálogo de fuentes por país: estado vigente en Producción al 14-10-2026
 * (docs/CATALOGO_FUENTES_PROSPECCION_POR_PAIS_SECTOR.md del repo SellUp).
 * `identity`: número fiscal por nombre · `free`: capa gratuita por industria.
 */

export interface CountrySources {
  code: string
  flag: string
  name: string
  taxId: string
  identity: readonly string[]
  free: readonly string[]
}

export const COUNTRIES: readonly CountrySources[] = [
  { code: 'CO', flag: '🇨🇴', name: 'Colombia', taxId: 'NIT', identity: ['Supersociedades SIIS · 10.000', 'Cámaras de Comercio (en vivo)', 'Entidades públicas · 4.929'], free: ['SIIS por CIIU', 'Gobierno (SIGEP 200+ servidores)'] },
  { code: 'MX', flag: '🇲🇽', name: 'México', taxId: 'RFC', identity: ['CompraNet · 26.393', 'Listas públicas SAT/NL/CDMX · 90.954'], free: ['DENUE por SCIAN (en vivo)'] },
  { code: 'CL', flag: '🇨🇱', name: 'Chile', taxId: 'RUT', identity: ['SII · 1.699.728', 'Registro de Empresas y Sociedades · 1.265.085', 'Alias de marca · 4.111'], free: ['SII 100+ trabajadores · 10.942'] },
  { code: 'PE', flag: '🇵🇪', name: 'Perú', taxId: 'RUC', identity: ['Padrón SUNAT · 862.987', 'Alias · 70.749'], free: ['SUNAT 200+ trabajadores · 3.069'] },
  { code: 'EC', flag: '🇪🇨', name: 'Ecuador', taxId: 'RUC', identity: ['Superintendencia de Compañías · 182.941', 'SRI · 108.778'], free: ['SCVS 100+ empleados · 2.041', 'Entidades públicas del SRI'] },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina', taxId: 'CUIT', identity: ['Registro Nacional de Sociedades · 1.194.956', 'Entidades públicas · 337'], free: ['ATP 100+ trabajadores · 2.851', 'RNS proveedoras del Estado · 6.350'] },
  { code: 'BR', flag: '🇧🇷', name: 'Brasil', taxId: 'CNPJ', identity: ['Receita (capa liviana) · 1.399.168', 'Alias · 470.646', 'CVM'], free: ['Receita por industria · 120.427'] },
  { code: 'UY', flag: '🇺🇾', name: 'Uruguay', taxId: 'RUT', identity: ['RUPE · 30.315'], free: ['ARCE · 2.315', 'Gobierno · 108'] },
  { code: 'PY', flag: '🇵🇾', name: 'Paraguay', taxId: 'RUC', identity: ['Padrón DNIT · 99.319'], free: ['DNCP · 1.127'] },
  { code: 'BO', flag: '🇧🇴', name: 'Bolivia', taxId: 'NIT', identity: ['Grandes contribuyentes · 4.477', 'SEPREC (en vivo)'], free: ['Entidades de gob.bo · 653'] },
  { code: 'CR', flag: '🇨🇷', name: 'Costa Rica', taxId: 'Cédula jurídica', identity: ['Registro unido · 19.911'], free: ['SICOP, Zona Franca, Grandes Contribuyentes y Gobierno · 2.364'] },
  { code: 'PA', flag: '🇵🇦', name: 'Panamá', taxId: 'RUC', identity: ['Registro unido · 8.106'], free: ['PanamaCompra y Gobierno · 608'] },
  { code: 'GT', flag: '🇬🇹', name: 'Guatemala', taxId: 'NIT', identity: ['Registro unido · 14.293', 'RGAE · 6.245'], free: ['Guatecompras · 1.705'] },
  { code: 'SV', flag: '🇸🇻', name: 'El Salvador', taxId: 'NIT', identity: ['Listados de Hacienda · 3.241'], free: ['COMPRASAL · 157', 'Grandes Contribuyentes · 581'] },
  { code: 'HN', flag: '🇭🇳', name: 'Honduras', taxId: 'RTN', identity: ['ONCAE + SEFIN · 6.195'], free: ['HonduCompras · 1.272', 'Gobierno · 118'] },
  { code: 'NI', flag: '🇳🇮', name: 'Nicaragua', taxId: 'RUC', identity: ['Grandes Contribuyentes DGI + MINSA · 1.295'], free: ['Directorio con RUC · 996'] },
  { code: 'DO', flag: '🇩🇴', name: 'Rep. Dominicana', taxId: 'RNC', identity: ['Padrón DGII · 493.548', 'Nombres comerciales · 14.981'], free: ['DGII con señal de tamaño · 12.931'] },
  { code: 'VE', flag: '🇻🇪', name: 'Venezuela', taxId: 'RIF', identity: ['RIF oficial · 636'], free: ['Directorio con RIF · 573'] },
  { code: 'US', flag: '🇺🇸', name: 'Estados Unidos', taxId: 'EIN', identity: ['SEC EDGAR · 6.129', 'IRS sin ánimo de lucro · 65.605'], free: ['IRS, SEC, IPEDS y SAM · 14.206', 'Gobierno .gov · 1.803'] },
  { code: 'ES', flag: '🇪🇸', name: 'España', taxId: 'NIF', identity: ['Contratación del Estado · 80.037', 'Ayudas y registros oficiales · 167.881'], free: ['Grandes empresas por industria · 12.889', 'Gobierno · 3.618'] },
]

/** Fuentes destacadas para las tarjetas (filas en Producción). */
export const FEATURED: readonly { flag: string; name: string; value: string; note: string }[] = [
  { flag: '🇨🇱', name: 'SII', value: '1.699.728', note: 'empresas con RUT oficial' },
  { flag: '🇧🇷', name: 'Receita · capa liviana', value: '1.399.168', note: 'empresas con CNPJ' },
  { flag: '🇦🇷', name: 'Registro Nacional de Sociedades', value: '1.194.956', note: 'sociedades con CUIT' },
  { flag: '🇵🇪', name: 'Padrón SUNAT', value: '862.987', note: 'contribuyentes con RUC' },
  { flag: '🇨🇴', name: 'Supersociedades SIIS', value: '10.000', note: 'empresas, primera fuente de NIT' },
  { flag: '🌎', name: 'Capa común LATAM', value: '7.106', note: 'universidades, reguladores, rankings · 16 países' },
]
