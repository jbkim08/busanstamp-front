import { create } from "zustand";

export const useAuthStore = create((set) => ({
  //전역으로 공유되는 변수
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  //로그인 됫을때 유저와 토큰을 저장
  setAuth: ({ user, accessToken }) => {
    localStorage.setItem("accessToken", accessToken);

    set({
      user,
      accessToken,
    });
  },
  //로그아웃 모두삭제
  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      user: null,
      accessToken: null,
    });
  },
}));
