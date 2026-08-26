import { Navigate, Route, Routes } from "react-router";

import AdminRoute from "../components/auth/AdminRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MyPage from "../pages/MyPage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceDetailPage from "../pages/PlaceDetailPage";
import PlaceListPage from "../pages/PlaceListPage";
import SignupPage from "../pages/SignupPage";
import AdminPlaceListPage from "../pages/admin/AdminPlaceListPage";
import AdminPlaceFormPage from "../pages/admin/AdminPlaceFormPage";
import KakaoSearchPage from "../pages/admin/KakaoSearchPage";
import MapPage from "../pages/MapPage";
import AdminPlaceQrPage from "../pages/admin/AdminPlaceQrPage";
import CheckinPage from "../pages/CheckinPage";
import StampBookPage from "../pages/StampBookPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 공개 페이지 */}
        <Route index element={<HomePage />} />

        <Route path="login" element={<LoginPage />} />

        <Route path="signup" element={<SignupPage />} />

        <Route path="map" element={<MapPage />} />

        <Route path="places">
          <Route index element={<PlaceListPage />} />

          <Route path=":placeId" element={<PlaceDetailPage />} />
        </Route>

        {/* 로그인 사용자 전용 */}
        <Route element={<ProtectedRoute />}>
          <Route path="mypage" element={<MyPage />} />
          <Route path="checkin" element={<CheckinPage />} />
          <Route path="stamps" element={<StampBookPage />} />
        </Route>

        {/* 관리자 전용 */}
        <Route path="admin" element={<AdminRoute />}>
          <Route index element={<Navigate to="places" replace />} />

          <Route path="places" element={<AdminPlaceListPage />} />

          <Route path="places/new" element={<AdminPlaceFormPage />} />

          <Route path="places/:placeId/edit" element={<AdminPlaceFormPage />} />

          <Route path="places/:placeId/qr" element={<AdminPlaceQrPage />} />

          {/* 카카오 검색 추가 */}
          <Route path="kakao-search" element={<KakaoSearchPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
