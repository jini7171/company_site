import { CertificationGallery } from "@/components/subpage/CertificationGallery";
import { CitySystemVisual } from "@/components/subpage/HeroVisuals";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { getCertificationCategories, getCertifications } from "@/content/certifications";
import { pageMetadata } from "@/lib/seo";

const PATH = "/company/certifications";

// 관리자 페이지에서 등록한 인증·특허(Supabase)를 60초마다 다시 가져옵니다.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: "인증 · 특허",
  description: "ESE의 기술력과 사업 역량을 증명하는 인증 · 특허 현황입니다.",
  path: PATH,
});

export default async function CertificationsPage() {
  const [items, categories] = await Promise.all([getCertifications(), getCertificationCategories()]);

  return (
    <>
      <SubpageHero
        href={PATH}
        eyebrow="CERTIFICATION"
        title="인증 · 특허"
        description="기술력과 사업 역량을 증명하는 ESE의 인증 · 특허 현황을 소개합니다."
        graphic={<CitySystemVisual active={["ai"]} />}
      />
      <SubNav href={PATH} />

      <SubSection index="01" eyebrow="CERTIFICATION & PATENT" title="인증 · 특허 현황">
        <CertificationGallery items={items} categories={categories} />
      </SubSection>

      <InquiryCTA />
    </>
  );
}
