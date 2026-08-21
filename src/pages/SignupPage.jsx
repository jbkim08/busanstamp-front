import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";

import { signup } from "../api/authApi";
import FormInput from "../components/form/FormInput";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

//회원가입 폼 객체(초기값)
const INITIAL_FORM = {
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
};

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);

  const [validationError, setValidationError] = useState("");

  //탠스택 쿼리의 useMutation은 서버 데이터 생성,수정,삭제시 사용
  const signupMutation = useMutation({
    mutationFn: signup, //authApi의 signup 함수 사용

    onSuccess: () => {
      //성공시 실행됨
      navigate("/login", {
        replace: true,
        state: {
          message: "회원가입이 완료되었습니다. 로그인해주세요.",
        },
      });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError("");
  };

  //서버 전송 이벤트
  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password !== form.passwordConfirm) {
      setValidationError("비밀번호 확인이 일치하지 않습니다.");

      return;
    }
    //텐스택쿼리 signupMutation의 signup 항수 실행 {이메일, 패스워드, 닉네임}
    signupMutation.mutate({
      email: form.email.trim(),
      password: form.password,
      nickname: form.nickname.trim(),
    });
  };

  const apiError = signupMutation.isError
    ? getApiErrorMessage(signupMutation.error, "회원가입에 실패했습니다.")
    : "";

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Busan Stamp Tour
          </p>

          <h1 className="mt-2 text-3xl font-bold">회원가입</h1>

          <p className="mt-2 text-sm text-slate-500">
            부산 여행 스탬프를 모을 계정을 만들어보세요.
          </p>
        </div>

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
            label="닉네임"
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="부산여행자"
            maxLength={20}
            autoComplete="nickname"
            required
          />

          <FormInput
            label="비밀번호"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="8자 이상 입력"
            minLength={8}
            maxLength={50}
            autoComplete="new-password"
            required
          />

          <FormInput
            label="비밀번호 확인"
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호 다시 입력"
            minLength={8}
            maxLength={50}
            autoComplete="new-password"
            error={validationError}
            required
          />

          {apiError && <ErrorMessage message={apiError} />}

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="
              w-full rounded-xl bg-blue-600 px-5 py-3
              font-semibold text-white transition
              hover:bg-blue-500
              disabled:cursor-not-allowed
              disabled:bg-slate-400
            "
          >
            {signupMutation.isPending ? "가입 처리 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          이미 계정이 있나요?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            로그인
          </Link>
        </p>
      </div>
    </section>
  );
}

function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

export default SignupPage;
