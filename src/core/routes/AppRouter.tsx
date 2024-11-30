import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "../context/AuthContext";
import AppNavbar from "../components/Navbar";
import PrivateRoute from "./PrivateRoute";
import { FaSpinner } from "react-icons/fa";
import HomePage from "../../pages/home/HomePage";
import LoginPage from "../../pages/LoginPage";
import DetailPage from "../../pages/detailFood/DetailPage";
import SearchPage from "../../pages/search/SearchPage";
import ModifyFoodDetail from "../../pages/detailFood/ModifyFoodDetail";
import AdminPage from "../../pages/AdminPage";

export const AppRouter = () => {
  return (
    <AuthProvider>
      <AppNavbar />
      <Suspense fallback={<FaSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search/details/:code" element={<DetailPage />} />
          <Route
            path="panel-admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />

          <Route
            path="search/modify-details-food/:code"
            element={
              <PrivateRoute>
                <ModifyFoodDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};
