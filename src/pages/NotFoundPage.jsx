import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section className="py-20 text-center">
      <p className="text-7xl font-black text-slate-200">404</p>

      <h1 className="mt-5 text-2xl font-bold">페이지를 찾을 수 없습니다.</h1>

      <Link
        to="/"
        className="mt-7 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
      >
        홈으로 이동
      </Link>
    </section>
  );
}

export default NotFoundPage;
