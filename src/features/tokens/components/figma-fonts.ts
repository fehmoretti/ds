/**
 * Lista curada de fontes disponíveis no Figma (Google Fonts).
 * Estas são as fontes que o Figma oferece nativamente para todos os usuários.
 *
 * Fonte: https://fonts.google.com/ (catálogo usado pelo Figma)
 */

export const FIGMA_SANS_FONTS: readonly string[] = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Source Sans 3',
  'Noto Sans',
  'Raleway',
  'Nunito',
  'Nunito Sans',
  'Work Sans',
  'Mulish',
  'Rubik',
  'DM Sans',
  'Manrope',
  'Plus Jakarta Sans',
  'Figtree',
  'Outfit',
  'Lexend',
  'Public Sans',
  'IBM Plex Sans',
  'Karla',
  'Quicksand',
  'Barlow',
  'PT Sans',
  'Oxygen',
  'Ubuntu',
  'Fira Sans',
  'Cabin',
  'Hind',
  'Heebo',
  'Archivo',
  'Bricolage Grotesque',
  'Onest',
  'Geist',
  'Albert Sans',
  'Be Vietnam Pro',
  'Sora',
  'Urbanist',
  'Space Grotesk',
];

export const FIGMA_SERIF_FONTS: readonly string[] = [
  'Playfair Display',
  'Merriweather',
  'Lora',
  'PT Serif',
  'Noto Serif',
  'Source Serif 4',
  'Crimson Text',
  'Libre Baskerville',
  'EB Garamond',
  'Cormorant Garamond',
  'DM Serif Display',
  'Bitter',
  'Bodoni Moda',
  'Fraunces',
  'Instrument Serif',
];

export const FIGMA_DISPLAY_FONTS: readonly string[] = [
  'Oswald',
  'Bebas Neue',
  'Anton',
  'Archivo Black',
  'Righteous',
  'Russo One',
  'Abril Fatface',
];

export const FIGMA_MONO_FONTS: readonly string[] = [
  'JetBrains Mono',
  'Fira Code',
  'Source Code Pro',
  'IBM Plex Mono',
  'Roboto Mono',
  'Space Mono',
  'Inconsolata',
  'Ubuntu Mono',
  'PT Mono',
  'Anonymous Pro',
  'Courier Prime',
  'DM Mono',
  'Cousine',
  'Geist Mono',
  'Overpass Mono',
];

export const FIGMA_BASE_FONTS: readonly string[] = [
  ...FIGMA_SANS_FONTS,
  ...FIGMA_SERIF_FONTS,
  ...FIGMA_DISPLAY_FONTS,
];

/**
 * Carrega uma fonte via Google Fonts dinamicamente injetando um <link>.
 * Evita duplicar a injeção para a mesma família.
 */
const loadedFonts = new Set<string>();

export function loadGoogleFont(family: string): void {
  if (typeof document === 'undefined') return;
  const trimmed = family.trim();
  if (!trimmed) return;
  if (loadedFonts.has(trimmed)) return;

  // Apenas carrega famílias conhecidas do catálogo Figma/Google Fonts
  const known = new Set<string>([
    ...FIGMA_SANS_FONTS,
    ...FIGMA_SERIF_FONTS,
    ...FIGMA_DISPLAY_FONTS,
    ...FIGMA_MONO_FONTS,
  ]);
  if (!known.has(trimmed)) return;

  const familyParam = trimmed.replace(/\s+/g, '+');
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;500;600;700&display=swap`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  loadedFonts.add(trimmed);
}
