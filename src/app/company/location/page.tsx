import { MapPin } from "lucide-react";
import { InquiryCTA } from "@/components/subpage/InquiryCTA";
import { Placeholder } from "@/components/subpage/Placeholder";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { SubSection } from "@/components/subpage/SubSection";
import { locationInfo } from "@/content/company";
import { contactChannels, PLACEHOLDER_TEXT } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const PATH = "/company/location";

export const metadata = pageMetadata({
  title: "오시는 길",
  description: "ESE 본사 위치와 연락처, 교통편 안내입니다.",
  path: PATH,
});

export default function LocationPage() {
  const contacts = contactChannels.filter((c) => c.key === "phone" || c.key === "email");

  return (
    <>
      <SubpageHero href={PATH} eyebrow="LOCATION" title="오시는 길" description="ESE 본사 위치와 연락처를 안내합니다." />
      <SubNav href={PATH} />

      <SubSection index="01" eyebrow="HEAD OFFICE" title="본사 안내">
        {/* TODO: 주소 확정 후 지도 Embed(카카오맵·네이버지도 등)로 교체 */}
        <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden border border-line bg-subtle">
          <div aria-hidden="true" className="bg-spatial-grid absolute inset-0 opacity-70" />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
              <MapPin aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="text-[15px] text-muted">주소가 확정되면 지도가 표시됩니다.</p>
          </div>
        </div>

        <dl className="mt-10 grid border-t border-ink md:grid-cols-3">
          <div className="border-b border-line py-6 md:pr-6">
            <dt className="font-en text-eyebrow font-semibold uppercase text-muted">Address</dt>
            <dd className={`mt-3 text-[17px] ${locationInfo.address ? "text-ink" : "text-muted"}`}>
              {locationInfo.address ?? PLACEHOLDER_TEXT}
            </dd>
          </div>
          {contacts.map((c) => (
            <div key={c.key} className="border-b border-line py-6 md:pr-6">
              <dt className="font-en text-eyebrow font-semibold uppercase text-muted">{c.en}</dt>
              <dd className={`mt-3 text-[17px] ${c.value ? "text-ink" : "text-muted"}`}>{c.value ?? PLACEHOLDER_TEXT}</dd>
            </div>
          ))}
        </dl>
      </SubSection>

      <SubSection index="02" eyebrow="TRANSPORTATION" title="교통편 안내" tone="subtle">
        {locationInfo.transit.length > 0 ? (
          <ul className="border-t border-ink">
            {locationInfo.transit.map((t) => (
              <li key={t.type} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-5 text-[16px]">
                <span className="font-semibold">{t.type}</span>
                <span className="text-ink/80">{t.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder>교통편 정보를 준비하고 있습니다.</Placeholder>
        )}
      </SubSection>

      <InquiryCTA />
    </>
  );
}
