import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";

import Layout from "@/routes/layout";
import { Toaster } from "react-hot-toast";
import DashboardPage from "@/routes/dashboard/page";
import LoginPage from "@/routes/auth/login";
import RegisterPage from "@/routes/auth/register";
import ForgotPasswordPage from "@/routes/auth/forgot-password";
import EmployeesPage from "@/routes/human/employees";
import PayrollPage from "@/routes/payroll/payroll";
import AttendancePage from "@/routes/payroll/attendance";
import MyPayrollPage from "@/routes/payroll/my-payroll";
import NotFoundPage from "@/routes/not-found";

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
                },
                {
                    path: "forgot-password",
                    element: <ForgotPasswordPage />,
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
                        {
                            path: "human",
                            element: <EmployeesPage />,
                        },
                        {
                            path: "payroll",
                            element: <PayrollPage />,
                        },
                        {
                            path: "attendance",
                            element: <AttendancePage />,
                        },
                        {
                            path: "my-payroll",
                            element: <MyPayrollPage />,
                        },
                    ],
                },
            ],
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
    ]);

    return (
        <AuthProvider>
            <ThemeProvider storageKey="theme">
                <RouterProvider router={router} />
                <Toaster position="top-right" />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
