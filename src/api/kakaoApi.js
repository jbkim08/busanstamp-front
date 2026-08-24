import apiClient from "./apiClient";

/**
 * 카카오 장소 검색
 */
export async function searchKakaoPlaces({ query, page = 1, size = 15 }) {
  const response = await apiClient.get("/admin/kakao/places/search", {
    params: {
      query,
      page,
      size,
    },
  });

  return response.data;
}

/**
 * 카카오 검색 장소를 우리 DB에 저장
 */
export async function importKakaoPlace(placeData) {
  const response = await apiClient.post("/admin/places/from-kakao", placeData);

  return response.data;
}
