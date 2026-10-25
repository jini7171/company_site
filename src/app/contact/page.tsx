import { FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { InquiryForm } from "@/components/subpage/InquiryForm";
import { SubNav } from "@/components/subpage/SubNav";
import { SubpageHero } from "@/components/subpage/SubpageHero";
import { contactChannels, PLACEHOLDER_TEXT } from "@/content/site";
import type { ContactChannel } from "@/content/types";
import { pageMetadata } from "@/lib/seo";

const PATH = "/contact";

export const metadata = pageMetadata({
  title: "사업문의",
  description: "스마트시티, AI, 데이터 기반 사업에 대한 협력과 제안을 기다립니다.",
  path: PATH,
});

const ICONS: Record<ContactChannel["key"], typeof Phone> = { phone: Phone, email: Mail, form: FileText, kakao: MessageCircle };

export default function ContactPage() {
  const channels = contactChannels.filter((c) => c.key !== "form");

  return (
    <>
      <SubpageHero
        href={PATH}
        eyebrow="LET'S BUILD TOGETHER"
        title="사업문의"
        description="더 스마트한 도시를 위한 새로운 가능성을 함께 만들어갑니다. 스마트시티, AI, 데이터 기반 사업에 대한 협력과 제안을 기다립니다."
      />
      <SubNav href={PATH} />

      <section className="bg-subtle py-20 md:py-28">
        <div className="container grid max-w-content gap-14 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <p className="eyebrow">CONTACT</p>
            <h2 className="mt-5 text-[clamp(1.625rem,2.8vw,2.25rem)] font-bold leading-[1.3] tracking-[-0.03em]">
              문의 방법을
              <br />
              선택해 주세요
            </h2>
            <ul className="mt-10 border-t border-ink">
              {channels.map((c) => {
                const Icon = ICONS[c.key];
                return (
                  <li key={c.key} className="flex min-h-[76px] items-center gap-5 border-b border-line py-4">
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.6} />
                    <span className="flex flex-col gap-1">
                      <span className="font-en text-[12px] uppercase tracking-[0.1em] text-muted">{c.en}</span>
                      {c.value && c.href ? (
                        <a href={c.href} className="text-[16px] font-semibold hover:text-brand">
                          {c.value}
                        </a>
                      ) : (
                        <span className={`text-[16px] font-semibold ${c.value ? "text-ink" : "text-muted"}`}>{c.value ?? PLACEHOLDER_TEXT}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="lg:col-span-8">
            <div className="border border-line bg-white p-7 md:p-10">
              <p className="eyebrow">INQUIRY FORM</p>
              <h2 className="mt-4 text-[24px] font-bold tracking-[-0.02em]">온라인 사업문의</h2>
              <p className="mt-2 text-[15px] text-muted">
                <span className="text-brand">*</span> 표시는 필수 입력 항목입니다.
              </p>
              <div className="mt-8">
                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
