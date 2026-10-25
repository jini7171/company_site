import { ArrowUpRight, FileText, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { inquiryHref } from "@/content/navigation";
import { contactChannels, PLACEHOLDER_TEXT } from "@/content/site";
import type { ContactChannel } from "@/content/types";

const ICONS: Record<ContactChannel["key"], typeof Phone> = {
  phone: Phone,
  email: Mail,
  form: FileText,
  kakao: MessageCircle,
};

export function ContactCTA() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line bg-subtle py-24 md:py-28 lg:flex lg:min-h-[calc(100svh-var(--header-h))] lg:flex-col lg:justify-center lg:py-12">
      <div aria-hidden="true" className="bg-spatial-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_top,black,transparent_80%)]" />

      <div className="container relative max-w-content">
        <div className="grid gap-14 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3">
              <span className="font-semibold text-muted">05</span>
              <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
              LET&apos;S BUILD TOGETHER
            </p>
            <h2 id="contact-title" className="mt-8 font-kr text-section-kr font-bold">
              더 스마트한 도시를 위한
              <br />
              새로운 가능성을 함께 만들어갑니다
            </h2>
            <p className="mt-7 max-w-[520px] text-base leading-[1.75] text-muted md:text-[17px]">
              스마트시티, AI, 데이터 기반 사업에 대한
              <br className="hidden md:block" /> 다양한 협력과 제안을 기다립니다.
            </p>
            <div className="mt-10">
              <Button href={inquiryHref}>사업 문의하기</Button>
            </div>
          </div>

          <ul className="self-end border-t border-ink lg:col-span-5">
            {contactChannels.map((channel) => {
              const Icon = ICONS[channel.key];
              const content = (
                <>
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.6} />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="font-en text-[12px] uppercase tracking-[0.1em] text-muted">{channel.en}</span>
                    <span className={`text-[16px] font-semibold ${channel.value ? "text-ink" : "text-muted"}`}>
                      {channel.value ?? PLACEHOLDER_TEXT}
                    </span>
                  </span>
                  {channel.href && (
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 text-ink/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                    />
                  )}
                </>
              );
              return (
                <li key={channel.key} className="border-b border-line">
                  {channel.href ? (
                    <Link href={channel.href} className="group flex min-h-[76px] items-center gap-5 py-4 transition-colors hover:text-brand">
                      {content}
                    </Link>
                  ) : (
                    <div className="flex min-h-[76px] items-center gap-5 py-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
