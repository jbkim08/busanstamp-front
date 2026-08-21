import { Route, Routes } from "react-router";

import AdminRoute from "../components/auth/AdminRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

import AdminHomePage from "../pages/AdminHomePage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MyPage from "../pages/MyPage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceDetailPage from "../pages/PlaceDetailPage";
import PlaceListPage from "../pages/PlaceListPage";
import SignupPage from "../pages/SignupPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 공개 페이지 */}
        <Route index element={<HomePage />} />

        <Route path="login" element={<LoginPage />} />

        <Route path="signup" element={<SignupPage />} />

        <Route path="places">
          <Route index element={<PlaceListPage />} />

          <Route path=":placeId" element={<PlaceDetailPage />} />
        </Route>

        {/* 로그인 사용자 전용 */}
        <Route element={<ProtectedRoute />}>
          <Route path="mypage" element={<MyPage />} />
        </Route>

        {/* 관리자 전용 */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminHomePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
