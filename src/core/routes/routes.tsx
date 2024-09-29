import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

const UserContainer = lazy(() => import("../../pages/users/UserContainer"));
const HomeContainer = lazy(() => import("../../pages/home/HomeContainer"));
const Nutrients = lazy(() => import("../components/information/Nutrients"));
const SearchPage = lazy(() => import("../../pages/search/SearchPage"))

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
                element: <HomeContainer /> 
            },
            {
                path: "users",
                element: <UserContainer />,
                children: [
                    {
                        index: true,
                        element: <UserContainer />
                    },
                ],
            },
            {
                path: "nutrients",
                element: <Nutrients />
                
            },
            {
                path: "search",
                element: <SearchPage />,
                children: [
                    {
                        index: true,
                        element: <SearchPage />
                    },
                ],
            },
        ],
    },
]);
