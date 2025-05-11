import { useState, useEffect } from "react";

import { Footer } from "@/layouts/footer";

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simple loading simulation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-140px)] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 size-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome to your dashboard</p>
            <div className="mt-6">
                <Footer />
            </div>
        </div>
    );
};

export default DashboardPage;
