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

export const AppRouter = () => {
  return (
    <AuthProvider>
      <AppNavbar /> 
      <Suspense fallback={<FaSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search/details/:id" element={<DetailPage />} />

          <Route
            path="search/Modifydetails/:id"
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
