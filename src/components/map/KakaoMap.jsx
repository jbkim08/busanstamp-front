import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { useKakaoMapLoader } from "../../hooks/useKakaoMapLoader";

const DEFAULT_CENTER = {
  latitude: 35.1796,
  longitude: 129.0756,
};

const KakaoMap = forwardRef(function KakaoMap(
  { places, userLocation, selectedPlaceId, onSelectPlace },
  ref,
) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const openInfoWindowRef = useRef(null); //빈 ref 객체
  const userOverlayRef = useRef(null); //빈 ref 객체

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
      moveToLocation(location) {
        if (!mapRef.current) {
          return;
        }

        const position = new window.kakao.maps.LatLng(
          Number(location.latitude),
          Number(location.longitude),
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

  // 내 위치 표시 추가하기
  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      return;
    }

    const kakao = window.kakao;

    /*
     * 기존 내 위치 표시 제거
     */
    if (userOverlayRef.current) {
      userOverlayRef.current.setMap(null);

      userOverlayRef.current = null;
    }

    if (!userLocation) {
      return;
    }

    const position = new kakao.maps.LatLng(
      Number(userLocation.latitude),
      Number(userLocation.longitude),
    );

    /*
     * 내 위치 표시용 DOM
     */
    const wrapper = document.createElement("div");

    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";

    wrapper.style.width = "26px";
    wrapper.style.height = "26px";

    wrapper.style.borderRadius = "50%";

    wrapper.style.background = "rgba(37, 99, 235, 0.2)";

    const dot = document.createElement("div");

    dot.style.width = "14px";
    dot.style.height = "14px";

    dot.style.borderRadius = "50%";

    dot.style.background = "#2563eb";

    dot.style.border = "3px solid white";

    dot.style.boxShadow = "0 1px 6px rgba(0,0,0,0.3)";

    wrapper.appendChild(dot);

    const overlay = new kakao.maps.CustomOverlay({
      map: mapRef.current,
      position,
      content: wrapper,
      xAnchor: 0.5,
      yAnchor: 0.5,
      zIndex: 10,
    });

    userOverlayRef.current = overlay;

    return () => {
      overlay.setMap(null);
    };
  }, [isLoaded, userLocation]);

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

      //InfoWindow 컨텐트 생성
      const infoContent = document.createElement("div");
      infoContent.style.padding = "10px 12px";
      infoContent.style.minWidth = "150px";
      const title = document.createElement("strong");
      title.textContent = place.name;
      const address = document.createElement("div");
      address.textContent = place.address;
      address.style.marginTop = "5px";
      address.style.fontSize = "12px";
      address.style.color = "#64748b";
      infoContent.appendChild(title);
      infoContent.appendChild(address);
      //카카오맵의 객체로 생성
      const infoWindow = new kakao.maps.InfoWindow({
        content: infoContent,
        removable: true,
      });

      //클릭 이벤트시 인포컨텐츠도 나옴
      kakao.maps.event.addListener(marker, "click", () => {
        openInfoWindowRef.current?.close();
        infoWindow.open(map, marker); // 추가
        openInfoWindowRef.current = infoWindow; //현재 선택된 인포윈도우
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
    if (markersRef.current.length === 1) {
      const place = places[0];
      const position = new kakao.maps.LatLng(
        Number(place.latitude),
        Number(place.longitude),
      );
      map.setCenter(position);
      map.setLevel(4); //1개 장소일때 4레벨 확대
    } else if (markersRef.current.length > 1) {
      map.setBounds(bounds); //2개 이상일때 자동설정
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
