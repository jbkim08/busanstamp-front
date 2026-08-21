import { Settings } from "lucide-react";

function AdminHomePage() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
          <Settings />
        </div>

        <div>
          <h1 className="text-2xl font-bold">관리자 페이지</h1>

          <p className="mt-1 text-slate-500">
            ADMIN 사용자만 접근할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-slate-600">
        다음 단계에서 관광 장소 관리와 카카오 장소 검색 화면을 연결합니다.
      </div>
    </section>
  );
}

export default AdminHomePage;
