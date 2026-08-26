import apiClient from "./apiClient";

//서버로 체크인 요청 (토큰 필요)
export async function checkin(token) {
  const response = await apiClient.post("/checkins", {
    token,
  });

  return response.data;
}

/**
 * 내 스탬프북
 */
export async function getMyStampBook() {
  const response = await apiClient.get("/checkins/me");

  return response.data;
}
