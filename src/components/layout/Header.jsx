import { LogOut, MapPinned, Settings, UserRound } from "lucide-react";

import { NavLink, useNavigate } from "react-router";

import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";

function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    // 로그인 사용자와 관련된 캐시 제거
    queryClient.clear();
    navigate("/", {
      replace: true,
    });
  };

  const getLinkClassName = ({ isActive }) => {
    const baseClass = "rounded-lg px-3 py-2 text-sm font-medium transition";

    return isActive
      ? `${baseClass} bg-blue-600 text-white`
      : `${baseClass} text-slate-600 hover:bg-slate-100`;
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <MapPinned className="text-blue-600" />
          부산 스탬프 투어
        </NavLink>

        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/" className={getLinkClassName}>
            홈
          </NavLink>

          <NavLink to="/places" className={getLinkClassName}>
            관광 장소
          </NavLink>

          {user ? (
            <>
              <NavLink to="/mypage" className={getLinkClassName}>
                <span className="flex items-center gap-1">
                  <UserRound size={16} />
                  {user.nickname}
                </span>
              </NavLink>

              {user.role === "ADMIN" && (
                <NavLink to="/admin" className={getLinkClassName}>
                  <span className="flex items-center gap-1">
                    <Settings size={16} />
                    관리자
                  </span>
                </NavLink>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getLinkClassName}>
                로그인
              </NavLink>

              <NavLink to="/signup" className={getLinkClassName}>
                회원가입
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
