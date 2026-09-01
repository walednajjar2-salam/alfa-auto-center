"use client";

import { useActionState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="login-form">
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <label>
        <span>اسم المستخدم</span>
        <div className="input-shell">
          <UserRound size={18} />
          <input name="username" placeholder="أدخل اسم المستخدم" autoComplete="username" required />
        </div>
      </label>
      <label>
        <span>كلمة المرور</span>
        <div className="input-shell">
          <LockKeyhole size={18} />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="أدخل كلمة المرور"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="إظهار أو إخفاء كلمة المرور"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>
      <button className="primary-button" disabled={pending} type="submit">
        <LogIn size={18} /> {pending ? "جاري الدخول..." : "تسجيل الدخول"}
      </button>
      <p className="login-footer">
        <a href="/forgot-password">نسيت كلمة المرور؟</a>
      </p>
    </form>
  );
}
