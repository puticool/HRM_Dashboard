import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { BookCopy, Users, WholeWord, SignalHigh } from "lucide-react";
import StatCard from "@/components/Stat-card";
import OverviewChart from "@/components/Overview";

const DashboardPage = () => {
    const [stats] = useState([
        { title: "Total Users", value: 1254, percentage: 12, icon: Users, iconColor: "blue" },
        { title: "Total Words", value: 5847, percentage: 8, icon: WholeWord, iconColor: "green" },
        { title: "Total Topics", value: 42, percentage: 15, icon: BookCopy, iconColor: "amber" },
        { title: "Total Levels", value: 10, percentage: 5, icon: SignalHigh, iconColor: "purple" }
    ]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [overviewData] = useState([
        { name: "Jan", words: 400, users: 100 },
        { name: "Feb", words: 500, users: 120 },
        { name: "Mar", words: 650, users: 150 },
        { name: "Apr", words: 800, users: 180 },
        { name: "May", words: 950, users: 220 },
        { name: "Jun", words: 1100, users: 250 }
    ]);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={isLoading ? "..." : stat.value}
                        percentage={stat.percentage}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-1 md:col-span-2 lg:col-span-7">
                    <OverviewChart data={overviewData} title="Overview" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;