import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { useKakaoMapLoader } from "../../hooks/useKakaoMapLoader";

const DEFAULT_CENTER = {
  latitude: 35.1796,
  longitude: 129.0756,
};

const KakaoMap = forwardRef(function KakaoMap(
  { places, selectedPlaceId, onSelectPlace },
  ref,
) {
  const containerRef = useRef(null);

  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const { isLoaded, error } = useKakaoMapLoader();

  /*
   * 부모에서 원하는 장소로
   * 지도 이동 가능하도록 메서드 노출
   */
  useImperativeHandle(
    ref,
    () => ({
      moveToPlace(place) {
        if (!mapRef.current || !window.kakao) {
          return;
        }

        const position = new window.kakao.maps.LatLng(
          Number(place.latitude),
          Number(place.longitude),
        );

        mapRef.current.panTo(position);

        mapRef.current.setLevel(4);
      },
    }),
    [],
  );

  /*
   * 최초 지도 생성
   */
  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) {
      return;
    }

    const kakao = window.kakao;

    const center = new kakao.maps.LatLng(
      DEFAULT_CENTER.latitude,
      DEFAULT_CENTER.longitude,
    );

    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center,
      level: 8,
    });
  }, [isLoaded]);

  /*
   * places가 바뀔 때마다
   * 마커 다시 생성
   */
  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      return;
    }

    const kakao = window.kakao;

    const map = mapRef.current;

    /*
     * 기존 마커 제거
     */
    markersRef.current.forEach(({ marker }) => {
      marker.setMap(null);
    });

    markersRef.current = [];

    if (!places.length) {
      return;
    }

    const bounds = new kakao.maps.LatLngBounds();

    places.forEach((place) => {
      const latitude = Number(place.latitude);

      const longitude = Number(place.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      const position = new kakao.maps.LatLng(latitude, longitude);

      const marker = new kakao.maps.Marker({
        map,
        position,
        title: place.name,
        clickable: true,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        onSelectPlace(place);
      });

      markersRef.current.push({
        placeId: place.placeId,
        marker,
      });

      bounds.extend(position);
    });

    /*
     * 모든 관광 장소 마커가
     * 화면에 들어오도록 자동 조정
     */
    if (markersRef.current.length > 0) {
      map.setBounds(bounds);
    }

    return () => {
      markersRef.current.forEach(({ marker }) => {
        marker.setMap(null);
      });

      markersRef.current = [];
    };
  }, [isLoaded, places, onSelectPlace]);

  /*
   * 선택 장소가 변경되면
   * 해당 위치로 부드럽게 이동
   */
  useEffect(() => {
    if (!selectedPlaceId || !mapRef.current) {
      return;
    }

    const selectedPlace = places.find(
      (place) => place.placeId === selectedPlaceId,
    );

    if (!selectedPlace) {
      return;
    }

    const position = new window.kakao.maps.LatLng(
      Number(selectedPlace.latitude),
      Number(selectedPlace.longitude),
    );

    mapRef.current.panTo(position);
  }, [selectedPlaceId, places]);

  if (error) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-3xl bg-red-50 p-6 text-center text-red-700">
        {error.message}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <p className="text-slate-500">카카오 지도를 불러오는 중입니다.</p>
        </div>
      )}

      <div ref={containerRef} className="h-[600px] w-full" />
    </div>
  );
});

export default KakaoMap;
