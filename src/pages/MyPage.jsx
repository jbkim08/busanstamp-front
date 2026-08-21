import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { useAuthStore } from "../stores/authStore";

function MyPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <UserRound size={30} />
          </div>

          <div>
            <p className="text-sm text-slate-500">부산 스탬프 투어 회원</p>

            <h1 className="mt-1 text-2xl font-bold">{user.nickname}</h1>
          </div>
        </div>

        <dl className="mt-7 space-y-5">
          <UserInfoRow
            icon={<Mail size={20} />}
            label="이메일"
            value={user.email}
          />

          <UserInfoRow
            icon={<ShieldCheck size={20} />}
            label="권한"
            value={user.role}
          />

          <UserInfoRow
            icon={<UserRound size={20} />}
            label="사용자 번호"
            value={user.userId}
          />
        </dl>
      </div>
    </section>
  );
}

function UserInfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-blue-600">{icon}</div>

      <dt className="w-28 text-sm font-semibold text-slate-500">{label}</dt>

      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}

export default MyPage;
