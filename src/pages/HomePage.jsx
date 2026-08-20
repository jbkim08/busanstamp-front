import { Link } from "react-router";
import { Map, QrCode, Stamp } from "lucide-react";

function HomePage() {
  return (
    <div>
      <section className="rounded-3xl bg-slate-900 px-8 py-16 text-white">
        <p className="mb-3 text-sm font-semibold text-blue-300">
          Busan Stamp Tour
        </p>

        <h1 className="max-w-2xl text-4xl font-bold leading-tight">
          부산 관광지를 여행하고
          <br />
          QR 스탬프를 모아보세요.
        </h1>

        <p className="mt-5 max-w-xl text-slate-300">
          지도에서 관광 장소를 찾고, 현장의 QR을 스캔하여 방문 스탬프를 획득하는
          여행 서비스입니다.
        </p>

        <Link
          to="/places"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
        >
          관광 장소 둘러보기
        </Link>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <FeatureCard
          icon={<Map />}
          title="지도 검색"
          description="카카오맵으로 부산의 관광 장소를 확인합니다."
        />

        <FeatureCard
          icon={<QrCode />}
          title="QR 체크인"
          description="관광지 QR 코드를 촬영하여 방문을 인증합니다."
        />

        <FeatureCard
          icon={<Stamp />}
          title="스탬프 수집"
          description="장소를 방문하고 여행 스탬프를 모읍니다."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>

      <h2 className="text-lg font-bold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}

export default HomePage;
