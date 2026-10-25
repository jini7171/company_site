import { LegalPage } from "@/components/subpage/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "이용약관", description: "ESE 웹사이트 이용약관", path: "/terms" });

export default function TermsPage() {
  return <LegalPage eyebrow="TERMS OF USE" title="이용약관" />;
}
