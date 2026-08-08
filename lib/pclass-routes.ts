export const CURRENT_EVENT = {
  slug: "uncp-2026-ii",
  name: "Solucionario UNCP 2026-II",
  campaign: "Experience OnlyOne",
  university: "UNCP",
} as const;

export const PUBLIC_SECTIONS = [
  { slug: "live", label: "Live", shortLabel: "Live", symbol: "▶" },
  {
    slug: "solucionario",
    label: "Solucionario",
    shortLabel: "Solución",
    symbol: "✓",
  },
  {
    slug: "recursos",
    label: "Recursos",
    shortLabel: "Recursos",
    symbol: "↓",
  },
  {
    slug: "resultados",
    label: "Resultados",
    shortLabel: "Resultados",
    symbol: "◎",
  },
  {
    slug: "orientacion",
    label: "Orientación",
    shortLabel: "Orientación",
    symbol: "↗",
  },
  {
    slug: "registro",
    label: "Registro",
    shortLabel: "Registro",
    symbol: "+",
  },
  {
    slug: "mi-pclass",
    label: "Mi PClass",
    shortLabel: "Mi PClass",
    symbol: "P",
  },
] as const;

export type PublicSectionSlug = (typeof PUBLIC_SECTIONS)[number]["slug"];

export const SECTION_COPY: Record<
  PublicSectionSlug,
  { eyebrow: string; title: string; description: string; action: string }
> = {
  live: {
    eyebrow: "Señal principal",
    title: "Live + participación",
    description:
      "Aquí podrás seguir la transmisión, leer el chat y participar después de tu registro mínimo.",
    action: "Ir al solucionario",
  },
  solucionario: {
    eyebrow: "Actualización en tiempo real",
    title: "Solucionario validado",
    description:
      "Busca por número, área o curso y distingue claramente respuestas preliminares, confirmadas y corregidas.",
    action: "Explorar recursos",
  },
  recursos: {
    eyebrow: "Material del evento",
    title: "Todo lo que necesitas",
    description:
      "Examen, claves, solucionario y guías se publicarán aquí con su estado y fuente correspondiente.",
    action: "Ver resultados",
  },
  resultados: {
    eyebrow: "Fuente oficial",
    title: "Resultados oficiales",
    description:
      "Cuando la universidad publique los resultados, encontrarás aquí el acceso directo a la fuente oficial.",
    action: "Pedir orientación",
  },
  orientacion: {
    eyebrow: "Tu siguiente paso",
    title: "Orientación Personal Class",
    description:
      "Conversa con el equipo para organizar tu preparación para el próximo examen.",
    action: "Quiero orientación",
  },
  registro: {
    eyebrow: "Desbloqueo progresivo",
    title: "Completa tu información",
    description:
      "Empieza con nombre, WhatsApp y consentimiento. Universidad y carrera se solicitarán solo cuando aporten valor.",
    action: "Volver al live",
  },
  "mi-pclass": {
    eyebrow: "Vista previa",
    title: "Tu espacio PClass",
    description:
      "Revisa el estado de tu acceso, tus recursos disponibles y los siguientes pasos de esta experiencia.",
    action: "Volver al live",
  },
};

export function eventPath(section?: string) {
  return section ? `/${CURRENT_EVENT.slug}/${section}` : `/${CURRENT_EVENT.slug}`;
}
