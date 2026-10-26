"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { type LoginState, login } from "@/app/admin/actions";
import { Field, inputCls } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5">
      <Field label="아이디">
        <input name="username" required autoComplete="username" autoFocus defaultValue={state.username} className={inputCls} />
      </Field>
      <Field label="비밀번호">
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </Field>
      {state.error && (
        <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2.5 text-[14px] text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-brand text-[15px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        로그인
      </button>
    </form>
  );
}
