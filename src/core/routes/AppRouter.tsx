import { Suspense, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { Routes, useLocation } from "react-router-dom";
import NavBar from "@/app/components/NavBar/Navbar";
import { useAuth } from "@/context/AuthContext";
import makeRequest from "@/utils/makeRequest";

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
      <NavBar/>
      <Suspense fallback={<FaSpinner/>}>
        <Routes>
            {/* <Route path="/" element={<HomePage/>}/>*/}
            {/*<Route path="login" element={<LoginPage/>}/>*/}
            {/*<Route path="search" element={<SearchPage/>}/>*/}
          {/*<Route path="comparison" element={<ComparisonPage/>}/>*/}
            {/*<Route path="search/details/:code" element={<DetailPage/>}/>*/}
            {/*<Route
            path="panel-admin"
            element={
              <PrivateRoute>
                <AdminPage/>
              </PrivateRoute>
            }
          />*/}

            {/*<Route
            path="search/modify-details-food/:code"
            element={
              <PrivateRoute>
                <ModifyFoodDetail/>
              </PrivateRoute>
            }
          />*/}
        </Routes>
      </Suspense>
    </>
  );
};
