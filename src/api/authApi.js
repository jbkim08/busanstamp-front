import apiClient from "./apiClient";

/**
 * 회원가입
 */
export async function signup(signupData) {
  const response = await apiClient.post("/auth/signup", signupData);

  return response.data;
}

/**
 * 로그인
 */
export async function login(loginData) {
  const response = await apiClient.post("/auth/login", loginData);

  return response.data;
}

/**
 * 현재 로그인 사용자 조회
 */
export async function getMyInfo() {
  const response = await apiClient.get("/auth/me");

  return response.data;
}
