import { useQuery } from "@tanstack/react-query";

import { Award, CheckCircle2, LockKeyhole, MapPin, Stamp } from "lucide-react";

import { Link } from "react-router";

import { getMyStampBook } from "../api/checkinApi";

import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function StampBookPage() {
  const {
    data: stampBook,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myStampBook"],

    queryFn: getMyStampBook,
  });

  if (isPending) {
    return <PageMessage message="스탬프북을 불러오는 중입니다." />;
  }

  if (isError) {
    return (
      <PageMessage
        message={getApiErrorMessage(error, "스탬프북을 불러오지 못했습니다.")}
      />
    );
  }

  const acquiredStamps = stampBook.stamps.filter((stamp) => stamp.acquired);

  return (
    <section>
      <StampBookHeader stampBook={stampBook} />

      <ProgressCard stampBook={stampBook} />

      <div className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold">나의 스탬프</h2>

          <p className="mt-1 text-slate-500">
            부산 곳곳을 방문해 스탬프를 완성해보세요.
          </p>
        </div>

        {stampBook.stamps.length === 0 ? (
          <PageMessage message="아직 등록된 관광 장소가 없습니다." />
        ) : (
          <div
            className="
            grid gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
          >
            {stampBook.stamps.map((stamp) => (
              <StampCard key={stamp.placeId} stamp={stamp} />
            ))}
          </div>
        )}
      </div>

      {acquiredStamps.length > 0 && <VisitHistory stamps={acquiredStamps} />}
    </section>
  );
}

function StampBookHeader({ stampBook }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        <div
          className="
          flex size-16
          items-center justify-center
          rounded-2xl
          bg-amber-100
          text-amber-600
        "
        >
          <Stamp size={32} />
        </div>

        <div>
          <p
            className="
            text-sm font-semibold
            text-amber-600
          "
          >
            Busan Stamp Tour
          </p>

          <h1
            className="
            mt-1 text-3xl font-bold
          "
          >
            내 스탬프북
          </h1>
        </div>
      </div>

      <div className="text-right">
        <strong
          className="
          text-3xl
          text-blue-600
        "
        >
          {stampBook.acquiredCount}
        </strong>

        <span
          className="
          text-xl
          text-slate-400
        "
        >
          {" "}
          / {stampBook.totalCount}
        </span>

        <p
          className="
          mt-1 text-sm
          text-slate-500
        "
        >
          스탬프 획득
        </p>
      </div>
    </div>
  );
}

function ProgressCard({ stampBook }) {
  return (
    <div
      className="
      mt-8 rounded-3xl
      bg-slate-900
      p-7 text-white
    "
    >
      <div
        className="
        flex items-center
        justify-between
      "
      >
        <div>
          <p
            className="
            text-sm
            text-slate-400
          "
          >
            부산 여행 진행률
          </p>

          <strong
            className="
            mt-1 block
            text-3xl
          "
          >
            {stampBook.progressPercent}%
          </strong>
        </div>

        <Award
          size={42}
          className="
            text-amber-400
          "
        />
      </div>

      <div
        className="
        mt-6 h-3
        overflow-hidden
        rounded-full
        bg-slate-700
      "
      >
        <div
          className="
            h-full rounded-full
            bg-blue-500
            transition-all
            duration-500
          "
          style={{
            width: `${stampBook.progressPercent}%`,
          }}
        />
      </div>

      <div
        className="
        mt-4 flex
        justify-between
        text-sm
      "
      >
        <span
          className="
          text-green-400
        "
        >
          획득 {stampBook.acquiredCount}
        </span>

        <span
          className="
          text-slate-400
        "
        >
          남은 장소 {stampBook.remainingCount}
        </span>
      </div>
    </div>
  );
}

function StampCard({ stamp }) {
  return (
    <article
      className={`
        relative overflow-hidden
        rounded-3xl border
        bg-white transition

        ${
          stamp.acquired
            ? "border-green-200 shadow-sm"
            : "border-slate-200 opacity-75"
        }
      `}
    >
      <StampImage stamp={stamp} />

      <div className="p-5">
        <div
          className="
          flex items-center
          justify-between
          gap-3
        "
        >
          <span
            className="
            text-xs font-semibold
            text-blue-600
          "
          >
            {stamp.category}
          </span>

          {stamp.acquired ? (
            <span
              className="
              flex items-center gap-1
              rounded-full
              bg-green-50
              px-3 py-1
              text-xs font-bold
              text-green-700
            "
            >
              <CheckCircle2 size={14} />
              획득 완료
            </span>
          ) : (
            <span
              className="
              flex items-center gap-1
              rounded-full
              bg-slate-100
              px-3 py-1
              text-xs font-semibold
              text-slate-500
            "
            >
              <LockKeyhole size={14} />
              미방문
            </span>
          )}
        </div>

        <h2
          className="
          mt-3 text-xl font-bold
        "
        >
          {stamp.name}
        </h2>

        <p
          className="
          mt-2 flex
          items-start gap-2
          text-sm
          text-slate-500
        "
        >
          <MapPin
            size={16}
            className="
              mt-0.5 shrink-0
            "
          />

          {stamp.address}
        </p>

        {stamp.acquired && (
          <p
            className="
            mt-4 rounded-xl
            bg-green-50
            px-4 py-3
            text-sm font-semibold
            text-green-700
          "
          >
            🎉 {formatDateTime(stamp.checkedInAt)} 방문
          </p>
        )}

        {!stamp.acquired && (
          <Link
            to="/map"
            className="
              mt-4 inline-block
              text-sm font-semibold
              text-blue-600
            "
          >
            지도에서 찾아보기
          </Link>
        )}
      </div>

      {stamp.acquired && (
        <div
          className="
          pointer-events-none
          absolute right-4 top-4
          flex size-20
          rotate-12
          items-center
          justify-center
          rounded-full
          border-4
          border-green-500
          bg-white/90
          text-center
          text-xs font-black
          text-green-600
        "
        >
          BUSAN
          <br />
          STAMP
        </div>
      )}
    </article>
  );
}

function StampImage({ stamp }) {
  if (!stamp.imageUrl) {
    return (
      <div
        className="
        flex h-44
        items-center
        justify-center
        bg-slate-100
      "
      >
        <Stamp
          size={48}
          className="
            text-slate-300
          "
        />
      </div>
    );
  }

  return (
    <div
      className="
      relative h-44
      overflow-hidden
    "
    >
      <img
        src={stamp.imageUrl}
        alt={stamp.name}
        className={`
          h-full w-full
          object-cover

          ${stamp.acquired ? "" : "grayscale"}
        `}
      />

      {!stamp.acquired && (
        <div
          className="
          absolute inset-0
          bg-slate-900/25
        "
        />
      )}
    </div>
  );
}

function VisitHistory({ stamps }) {
  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2
          className="
          text-2xl font-bold
        "
        >
          최근 방문 기록
        </h2>

        <p
          className="
          mt-1 text-slate-500
        "
        >
          스탬프를 획득한 관광지입니다.
        </p>
      </div>

      <div
        className="
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
      "
      >
        <div
          className="
          divide-y
          divide-slate-200
        "
        >
          {stamps.map((stamp) => (
            <div
              key={stamp.placeId}
              className="
                  flex flex-wrap
                  items-center
                  justify-between
                  gap-3
                  px-5 py-4
                "
            >
              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <CheckCircle2
                  size={20}
                  className="
                      text-green-500
                    "
                />

                <div>
                  <strong>{stamp.name}</strong>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    {stamp.category}
                  </p>
                </div>
              </div>

              <time
                className="
                  text-sm
                  text-slate-500
                "
              >
                {formatDateTime(stamp.checkedInAt)}
              </time>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDateTime(dateTime) {
  if (!dateTime) {
    return "";
  }

  const date = new Date(dateTime);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function PageMessage({ message }) {
  return (
    <div
      className="
      rounded-2xl
      border border-slate-200
      bg-white
      p-12
      text-center
      text-slate-500
    "
    >
      {message}
    </div>
  );
}

export default StampBookPage;
