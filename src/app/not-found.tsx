import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container flex min-h-[70vh] max-w-content flex-col justify-center py-24">
      <p className="eyebrow">PAGE IN PREPARATION</p>
      <h1 className="mt-6 font-kr text-section-kr font-bold">페이지를 준비하고 있습니다</h1>
      <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-muted">
        요청하신 페이지는 현재 준비 중이거나 주소가 변경되었습니다.
      </p>
      <div className="mt-10">
        <Button href="/">홈으로 돌아가기</Button>
      </div>
    </section>
  );
}
