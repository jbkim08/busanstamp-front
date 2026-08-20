import { Outlet } from "react-router";
import Header from "./Header";

//기본 화면 구조 (헤더 상단), Outlet을 통해 페이지 표시
function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
