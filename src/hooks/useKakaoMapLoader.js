import { useEffect, useState } from "react";

let kakaoMapPromise = null;

function loadKakaoMapSdk() {
  //중복 로딩 방지 (싱글톤)
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve(window.kakao);
  }
  //카카맵이 존재하면 바로 쓸수 있게 리턴함
  if (kakaoMapPromise) {
    return kakaoMapPromise;
  }
  //환경변수로 카카오-자바스크립트-키를 가져옴
  const appKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
  //키가 없을경우 예외처리
  if (!appKey) {
    return Promise.reject(
      new Error("카카오 JavaScript Key가 설정되지 않았습니다."),
    );
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js` +
      `?appkey=${appKey}` +
      `&autoload=false`;

    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
    };

    script.onerror = () => {
      kakaoMapPromise = null;

      reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
    };

    document.head.appendChild(script);
  });

  return kakaoMapPromise;
}

export function useKakaoMapLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadKakaoMapSdk()
      .then(() => {
        if (!cancelled) {
          setIsLoaded(true);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isLoaded,
    error,
  };
}
