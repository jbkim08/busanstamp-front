import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { getPlace } from "../api/placeApi";

//관광장소 상세 페이지
function PlaceDetailPage() {
  const { placeId } = useParams();

  const {
    data: place,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["places", placeId],
    queryFn: () => getPlace(placeId),
    enabled: Boolean(placeId),
  });

  if (isPending) {
    return <p>관광 장소를 불러오는 중입니다.</p>;
  }

  if (isError) {
    return <p>관광 장소를 찾을 수 없습니다.</p>;
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {place.imageUrl && (
        <img
          src={place.imageUrl}
          alt={place.name}
          className="h-80 w-full object-cover"
        />
      )}

      <div className="p-8">
        <span className="text-sm font-semibold text-blue-600">
          {place.category}
        </span>

        <h1 className="mt-2 text-3xl font-bold">{place.name}</h1>

        <p className="mt-3 text-slate-500">{place.address}</p>

        <p className="mt-7 whitespace-pre-line leading-7 text-slate-700">
          {place.description || "등록된 장소 설명이 없습니다."}
        </p>

        <div className="mt-7 rounded-xl bg-slate-50 p-4 text-sm">
          <p>위도: {place.latitude}</p>
          <p>경도: {place.longitude}</p>
        </div>

        <Link
          to="/places"
          className="mt-7 inline-block font-semibold text-blue-600"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}

export default PlaceDetailPage;
