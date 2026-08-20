import { MapPinned } from "lucide-react";
import { NavLink } from "react-router";

//사이트 화면 상단의 메뉴부분
function Header() {
  const getLinkClassName = ({ isActive }) => {
    const baseClass = "rounded-lg px-3 py-2 text-sm font-medium transition";

    return isActive
      ? `${baseClass} bg-blue-600 text-white`
      : `${baseClass} text-slate-600 hover:bg-slate-100`;
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <MapPinned className="text-blue-600" />
          부산 스탬프 투어
        </NavLink>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={getLinkClassName}>
            홈
          </NavLink>

          <NavLink to="/places" className={getLinkClassName}>
            관광 장소
          </NavLink>

          <NavLink to="/login" className={getLinkClassName}>
            로그인
          </NavLink>

          <NavLink to="/signup" className={getLinkClassName}>
            회원가입
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
