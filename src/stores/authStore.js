import { create } from "zustand";

const ACCESS_TOKEN_KEY = "accessToken";

export const useAuthStore = create((set) => ({
  user: null,

  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),

  // 최초 인증 확인이 끝났는지 여부
  isInitialized: false,

  /**
   * 로그인 성공 처리
   */
  setAuth: ({ user, accessToken }) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    set({
      user,
      accessToken,
    });
  },

  /**
   * 새로고침 후 사용자 정보 복원
   */
  setUser: (user) => {
    set({ user });
  },

  /**
   * 로그인 상태 초기화 => 로그아웃
   */
  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    set({
      user: null,
      accessToken: null,
    });
  },

  /**
   * 최초 인증 확인 완료
   */
  finishInitialization: () => {
    set({
      isInitialized: true,
    });
  },
}));
