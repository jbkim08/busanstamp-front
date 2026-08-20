import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { getPlaces } from "../api/placeApi";

//관광장소 목록 페이지
function PlaceListPage() {
  const {
    data: places = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["places"],
    queryFn: () => getPlaces(),
  });

  if (isPending) {
    return <PageMessage message="관광 장소를 불러오는 중입니다." />;
  }

  if (isError) {
    return (
      <PageMessage
        message={
          error.response?.data?.message ?? "관광 장소를 불러오지 못했습니다."
        }
      />
    );
  }

  return (
    <section>
      <div className="mb-7">
        <h1 className="text-3xl font-bold">부산 관광 장소</h1>

        <p className="mt-2 text-slate-500">등록된 관광 장소를 확인해 보세요.</p>
      </div>

      {places.length === 0 ? (
        <PageMessage message="등록된 관광 장소가 없습니다." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.placeId} place={place} />
          ))}
        </div>
      )}
    </section>
  );
}

function PlaceCard({ place }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-video bg-slate-200">
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            이미지 없음
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {place.category}
        </span>

        <h2 className="mt-3 text-xl font-bold">{place.name}</h2>

        <p className="mt-2 flex gap-2 text-sm text-slate-500">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          {place.address}
        </p>

        <Link
          to={`/places/${place.placeId}`}
          className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-500"
        >
          상세보기
        </Link>
      </div>
    </article>
  );
}

function PageMessage({ message }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
      {message}
    </div>
  );
}

export default PlaceListPage;
