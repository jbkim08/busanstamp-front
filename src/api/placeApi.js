import apiClient from "./apiClient";

/**
 * 관광 장소 목록 조회
 *
 * params 예:
 * {
 *   keyword: "해운대",
 *   category: "관광명소"
 * }
 */
export async function getPlaces(params = {}) {
  const response = await apiClient.get("/places", {
    params,
  });

  return response.data;
}

/**
 * 관광 장소 상세 조회
 */
export async function getPlace(placeId) {
  const response = await apiClient.get(`/places/${placeId}`);
  return response.data;
}

/**
 * 관리자 관광 장소 등록
 */
export async function createAdminPlace(placeData) {
  const response = await apiClient.post("/admin/places", placeData);
  return response.data;
}

/**
 * 관리자 관광 장소 수정
 */
export async function updateAdminPlace(placeId, placeData) {
  const response = await apiClient.put(`/admin/places/${placeId}`, placeData);
  return response.data;
}

/**
 * 관리자 관광 장소 삭제
 */
export async function deleteAdminPlace(placeId) {
  await apiClient.delete(`/admin/places/${placeId}`);
}
