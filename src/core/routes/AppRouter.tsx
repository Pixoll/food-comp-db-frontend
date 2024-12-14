import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import AppNavbar from "../components/Navbar";
import PrivateRoute from "./PrivateRoute";
import { FaSpinner } from "react-icons/fa";
import HomePage from "../../pages/home/HomePage";
import LoginPage from "../../pages/LoginPage";
import DetailPage from "../../pages/detailFood/DetailPage";
import SearchPage from "../../pages/search/SearchPage";
import ModifyFoodDetail from "../../pages/detailFood/ModifyFoodDetail";
import AdminPage from "../../pages/AdminPage";
import { useAuth } from "../context/AuthContext";
import makeRequest from "../utils/makeRequest";

export const AppRouter = () => {
  const { state, logout } = useAuth();
  const location = useLocation()
  const { isAuthenticated, username, token } = state;

  useEffect(() => {
    console.log("before token state check");

    if (!isAuthenticated) return;

    console.log("starting token state check");

    makeRequest(
      "get",
      `/admins/${username}/session`,
      token,
      (response) => {
        console.log("still valid");
      },
      (error) => {
        console.log("logout");
        logout();
      }
    );
  }, [location, isAuthenticated, username, token]);

  return (
    <>
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
    </>
  );
};
