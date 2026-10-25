import { LegalPage } from "@/components/subpage/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "개인정보취급방침", description: "ESE 개인정보취급방침", path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage eyebrow="PRIVACY POLICY" title="개인정보취급방침" />;
}
