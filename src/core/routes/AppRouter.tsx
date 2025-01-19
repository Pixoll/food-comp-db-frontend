import { Suspense, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminPage from "../../pages/AdminPage";
import DetailPage from "../../pages/detailFood/DetailPage";
import ModifyFoodDetail from "../../pages/detailFood/ModifyFoodDetail";
import HomePage from "../../pages/home/HomePage";
import LoginPage from "../../pages/LoginPage";
import SearchPage from "../../pages/search/SearchPage";
import AppNavbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import makeRequest from "../utils/makeRequest";
import PrivateRoute from "./PrivateRoute";

export const AppRouter = () => {
  const { state, logout } = useAuth();
  const location = useLocation();
  const { isAuthenticated, username, token } = state;

  useEffect(() => {
    if (!isAuthenticated) return;

    makeRequest("get", `/admins/${username}/session`, {
      token,
      errorCallback: logout,
    });
    // eslint-disable-next-line
  }, [location, isAuthenticated, username, token]);

  return (
    <>
      <AppNavbar/>
      <Suspense fallback={<FaSpinner/>}>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="login" element={<LoginPage/>}/>
          <Route path="search" element={<SearchPage/>}/>
          <Route path="search/details/:code" element={<DetailPage/>}/>
          <Route
            path="panel-admin"
            element={
              <PrivateRoute>
                <AdminPage/>
              </PrivateRoute>
            }
          />

          <Route
            path="search/modify-details-food/:code"
            element={
              <PrivateRoute>
                <ModifyFoodDetail/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};
