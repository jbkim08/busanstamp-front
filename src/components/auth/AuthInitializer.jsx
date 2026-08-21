import { useEffect } from "react";
import { getMyInfo } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";

function AuthInitializer({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const finishInitialization = useAuthStore(
    (state) => state.finishInitialization,
  );

  useEffect(() => {
    async function initializeAuth() {
      if (!accessToken) {
        //토큰이 없을경우 종료
        finishInitialization();
        return;
      }

      try {
        //토큰이 있을경우 서버에서 유저정보 가져옴
        const user = await getMyInfo();

        setUser(user); //유저정보를 저장
      } catch {
        clearAuth(); //에러 발생시 토큰삭제
      } finally {
        finishInitialization(); //종료
      }
    }

    initializeAuth(); //처음 시작또는 새로고침 실행
  }, [accessToken, setUser, clearAuth, finishInitialization]);
  //토큰바뀜, 새로유저저장, 토큰삭제, 상태변경시 재시작

  //현재 인증이 안된 상태일때 리턴
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            로그인 정보를 확인하고 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default AuthInitializer;
