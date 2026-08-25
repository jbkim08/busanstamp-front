import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPinned, Search } from "lucide-react";
import { getPlaces } from "../api/placeApi";
import KakaoMap from "../components/map/KakaoMap";
import MapPlaceCard from "../components/map/MapPlaceCard";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { calculateDistance } from "../utils/distance";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

function MapPage() {
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [keyword, setKeyword] = useState("");

  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
    requestLocation,
  } = useCurrentLocation();

  const {
    data: places = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["places", "map"],
    queryFn: () => getPlaces(),
  });

  /*
   * 지도 페이지 안에서 간단한
   * 클라이언트 검색을 수행합니다.
   */
  const displayPlaces = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    /*
     * 검색
     */
    let result = places.filter((place) => {
      if (!search) {
        return true;
      }

      return (
        place.name?.toLowerCase().includes(search) ||
        place.address?.toLowerCase().includes(search) ||
        place.category?.toLowerCase().includes(search)
      );
    });

    /*
     * 현재 위치가 없으면
     * 거리 계산하지 않음
     */
    if (!location) {
      return result.map((place) => ({
        ...place,
        distance: null,
      }));
    }

    /*
     * 거리 계산
     */
    result = result.map((place) => ({
      ...place,

      distance: calculateDistance(
        location.latitude,
        location.longitude,

        Number(place.latitude),

        Number(place.longitude),
      ),
    }));

    /*
     * 가까운 순
     */
    result.sort((a, b) => a.distance - b.distance);

    return result;
  }, [places, keyword, location]);

  const handleSelectPlace = useCallback((place) => {
    setSelectedPlace(place);

    mapRef.current?.moveToPlace(place);
  }, []);

  const handleCurrentLocation = async () => {
    try {
      const currentLocation = await requestLocation();

      mapRef.current?.moveToLocation(currentLocation);
    } catch {
      return <PageMessage message={locationError} />;
    }
  };

  if (isPending) {
    return <PageMessage message="관광 장소를 불러오는 중입니다." />;
  }

  if (isError) {
    return (
      <PageMessage
        message={getApiErrorMessage(error, "관광 장소를 불러오지 못했습니다.")}
      />
    );
  }

  return (
    <section>
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <MapPinned />
          </div>

          <div>
            <h1 className="text-3xl font-bold">부산 관광 지도</h1>

            <p className="mt-1 text-slate-500">
              지도에서 관광 장소를 찾아보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={isLocationLoading}
            className="
          rounded-xl bg-blue-600
          px-5 py-3 font-semibold
          text-white transition
          hover:bg-blue-500
          disabled:bg-slate-400
        "
          >
            {isLocationLoading ? "현재 위치 확인 중..." : "📍 내 위치 찾기"}
          </button>

          {location && (
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              현재 위치를 확인했습니다.
              <span className="ml-2">
                정확도 약 {Math.round(location.accuracy)}m
              </span>
            </div>
          )}

          {locationError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {locationError}
            </div>
          )}
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="장소 이름, 주소, 카테고리 검색"
            className="
              w-full rounded-xl
              border border-slate-300
              py-3 pl-11 pr-4
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* 장소 목록 */}
        <aside>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">
              {location ? "내 주변 관광 장소" : "관광 장소"}
            </h2>

            {location && (
              <p className="mt-1 text-xs text-slate-400">
                현재 위치에서 가까운 순
              </p>
            )}

            <span className="text-sm text-slate-500">
              {displayPlaces.length}개
            </span>
          </div>

          <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
            {displayPlaces.length === 0 ? (
              <div className="rounded-2xl bg-slate-100 p-8 text-center text-sm text-slate-500">
                검색된 장소가 없습니다.
              </div>
            ) : (
              displayPlaces.map((place) => (
                <MapPlaceCard
                  key={place.placeId}
                  place={place}
                  distance={place.distance}
                  selected={selectedPlace?.placeId === place.placeId}
                  onClick={handleSelectPlace}
                />
              ))
            )}
          </div>
        </aside>

        {/* 카카오 지도 */}
        <KakaoMap
          ref={mapRef}
          places={displayPlaces}
          userLocation={location}
          selectedPlaceId={selectedPlace?.placeId}
          onSelectPlace={handleSelectPlace}
        />
      </div>

      {selectedPlace && <SelectedPlacePanel place={selectedPlace} />}
    </section>
  );
}

function SelectedPlacePanel({ place }) {
  return (
    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <p className="text-sm font-semibold text-blue-600">선택된 관광 장소</p>

      <h2 className="mt-1 text-xl font-bold">{place.name}</h2>

      <p className="mt-2 text-sm text-slate-600">{place.address}</p>

      <p className="mt-2 text-sm text-slate-500">
        위도 {place.latitude}
        {" · "}
        경도 {place.longitude}
      </p>
    </div>
  );
}

function PageMessage({ message }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
      {message}
    </div>
  );
}

export default MapPage;
