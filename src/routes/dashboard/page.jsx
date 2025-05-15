import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { Users, Building2, Briefcase, Bell } from "lucide-react";
import StatCard from "@/components/Stat-card";
import OverviewChart from "@/components/Overview";
import api from "@/utils/api";

const DashboardPage = () => {
    const [stats, setStats] = useState([
        { title: "Tổng số nhân viên", value: 0, percentage: 12, icon: Users, iconColor: "blue" },
        { title: "Tổng số phòng ban", value: 0, percentage: 8, icon: Building2, iconColor: "green" },
        { title: "Tổng số vị trí", value: 0, percentage: 15, icon: Briefcase, iconColor: "amber" },
        { title: "Tổng số thông báo", value: 0, percentage: 5, icon: Bell, iconColor: "purple" }
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
        // Fetch data from API
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch employees data
                const employeeResponse = await api.get('/hr/report/employees');
                
                // Fetch departments data
                const departmentResponse = await api.get('/hr/departments');
                
                // Fetch positions data
                const positionResponse = await api.get('/hr/positions');
                
                // Fetch anniversaries/notifications data
                const anniversariesResponse = await api.get('/hr/employees/anniversaries');
                
                // Update stats if requests are successful
                if (employeeResponse.data?.status === 'success' && 
                    departmentResponse.data?.status === 'success' &&
                    positionResponse.data?.status === 'success' &&
                    anniversariesResponse.data?.status === 'success') {
                    
                    setStats(prevStats => {
                        const newStats = [...prevStats];
                        // Update employee count
                        newStats[0] = {
                            ...newStats[0],
                            value: employeeResponse.data.data.total_employees
                        };
                        // Update department count
                        newStats[1] = {
                            ...newStats[1],
                            value: departmentResponse.data.data.length
                        };
                        // Update position count
                        newStats[2] = {
                            ...newStats[2],
                            value: positionResponse.data.data.length
                        };
                        // Update notifications count
                        newStats[3] = {
                            ...newStats[3],
                            value: anniversariesResponse.data.data.count
                        };
                        return newStats;
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDashboardData();
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