import { Route, Routes } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceDetailPage from "../pages/PlaceDetailPage";
import PlaceListPage from "../pages/PlaceListPage";
import SignupPage from "../pages/SignupPage";

//전체 애플리케이션의 경로를 정의 ( 공통 레이아웃 Mainlayout 적용 )
function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route path="places">
          <Route index element={<PlaceListPage />} />
          <Route path=":placeId" element={<PlaceDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
