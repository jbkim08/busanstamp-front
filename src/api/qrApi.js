import apiClient from "./apiClient";

//QR 이미지를 blob 타입으로 받음
export async function getPlaceQr(placeId) {
  const response = await apiClient.get(`/admin/places/${placeId}/qr`, {
    responseType: "blob",
  });

  return response.data;
}
