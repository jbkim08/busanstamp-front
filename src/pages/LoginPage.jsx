import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router";

import { login } from "../api/authApi";
import FormInput from "../components/form/FormInput";
import { useAuthStore } from "../stores/authStore";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
      });

      //const previousPath = location.state?.from?.pathname;
      const from = location.state?.from;
      //토큰도 저장하고 있고 로그인 성공시 다시 재요청함!
      const previousPath = from ? `${from.pathname}${from.search ?? ""}` : "/";

      navigate(previousPath ?? "/", {
        replace: true,
      });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  const apiError = loginMutation.isError
    ? getApiErrorMessage(loginMutation.error, "로그인에 실패했습니다.")
    : "";

  const successMessage = location.state?.message;

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Busan Stamp Tour
          </p>

          <h1 className="mt-2 text-3xl font-bold">로그인</h1>

          <p className="mt-2 text-sm text-slate-500">
            여행을 계속하려면 로그인해주세요.
          </p>
        </div>

        {successMessage && (
          <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="이메일"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@test.com"
            autoComplete="email"
            required
          />

          <FormInput
            label="비밀번호"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            autoComplete="current-password"
            required
          />

          {apiError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="
              w-full rounded-xl bg-blue-600 px-5 py-3
              font-semibold text-white transition
              hover:bg-blue-500
              disabled:cursor-not-allowed
              disabled:bg-slate-400
            "
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          아직 계정이 없나요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            회원가입
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
