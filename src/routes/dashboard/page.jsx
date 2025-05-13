import { useState, useEffect } from "react";

import { Footer } from "@/layouts/footer";
import Loading from "@/components/Loading";

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
        return <Loading />;
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
