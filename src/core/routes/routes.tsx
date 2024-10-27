import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

const HomeContainer = lazy(() => import("../../pages/home/HomePage"));
const Nutrients = lazy(() => import("../components/information/Nutrients"));
const SearchPage = lazy(() => import("../../pages/search/SearchPage"));
const DetailPage = lazy(() => import("../../pages/detailFood/DetailPage"));
const LoginPage = lazy(()=> import("../../pages/loginPage"))
export const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <HomeContainer />,
        },
        {
          path: "nutrients",
          element: <Nutrients />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "search/details/:id",
          element: <DetailPage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
      ],
    },
  ]);