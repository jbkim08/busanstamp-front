import apiClient from "./apiClient";

//장소검색 요청
export async function getPlaces(params = {}) {
  const response = await apiClient.get("/places", {
    params,
  });

  return response.data;
}

//상세한 장소 요청(id필요)
export async function getPlace(placeId) {
  const response = await apiClient.get(`/places/${placeId}`);

  return response.data;
}
