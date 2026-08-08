import { notFound } from "next/navigation";
import { SectionPreview } from "../../../components/section-preview";
import { PUBLIC_SECTIONS, type PublicSectionSlug } from "../../../lib/pclass-routes";

export default async function PublicSectionPage({
  params,
}: {
  params: Promise<{ eventSlug: string; section: string }>;
}) {
  const { section } = await params;
  const isKnownSection = PUBLIC_SECTIONS.some((item) => item.slug === section);

  if (!isKnownSection) {
    notFound();
  }

  return <SectionPreview section={section as PublicSectionSlug} />;
}
