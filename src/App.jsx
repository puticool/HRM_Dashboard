import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import LoginPage from "@/routes/auth/login";
import RegisterPage from "@/routes/auth/register";

function App() {
    const router = createBrowserRouter([
        {
            element: <PublicRoute />,
            children: [
                {
                    path: "login",
                    element: <LoginPage />,
                },
                {
                    path: "register",
                    element: <RegisterPage />,
                }
            ]
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <Layout />,
                    children: [
                        {
                            index: true,
                            element: <DashboardPage />,
                        },
                    ],
                },
            ],
        },
    ]);

    return (
        <AuthProvider>
            <ThemeProvider storageKey="theme">
                <RouterProvider router={router} />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
