import { useState } from "react";

export function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const requestLocation = () => {
    if (!window.isSecureContext) {
      const message =
        "현재 위치 기능은 HTTPS 또는 localhost 환경에서 사용할 수 있습니다.";
      setError(message);
      return Promise.reject(new Error(message));
    }

    if (!navigator.geolocation) {
      const message = "이 브라우저는 위치 정보를 지원하지 않습니다.";
      setError(message);
      return Promise.reject(new Error(message));
    }

    setIsLoading(true);
    setError("");

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setLocation(currentLocation);
          setIsLoading(false);
          resolve(currentLocation);
        },

        (positionError) => {
          const message = getLocationErrorMessage(positionError);

          setError(message);
          setIsLoading(false);

          reject(new Error(message));
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        },
      );
    });
  };

  return {
    location,
    isLoading,
    error,
    requestLocation,
  };
}

function getLocationErrorMessage(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "위치 권한이 거부되었습니다.";

    case error.POSITION_UNAVAILABLE:
      return "현재 위치를 확인할 수 없습니다.";

    case error.TIMEOUT:
      return "현재 위치 요청 시간이 초과되었습니다.";

    default:
      return "현재 위치를 가져오지 못했습니다.";
  }
}
