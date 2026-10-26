import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/admin";

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px] border border-line bg-white p-8 md:p-10">
        <p className="font-en text-eyebrow font-semibold uppercase text-brand">ESE ADMIN</p>
        <h1 className="mt-3 text-[24px] font-bold tracking-[-0.03em]">관리자 로그인</h1>
        <p className="mt-1 text-[14px] text-muted">게시물·사업실적·문의를 관리합니다.</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
