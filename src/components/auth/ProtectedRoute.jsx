import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "../../stores/authStore";

//인증 안되면 로그인 페이지로 이동
function ProtectedRoute() {
  const location = useLocation(); //요청한주소객체

  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (!accessToken || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location, //이전주소 전달
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
