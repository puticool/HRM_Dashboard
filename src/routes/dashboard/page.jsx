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
    const [overviewData, setOverviewData] = useState([]);

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

                // Fetch payroll data
                const payrollResponse = await api.get('/pr/payroll');
                
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

                // Process payroll data for overview
                if (payrollResponse.data?.status === 'success') {
                    const payrollData = payrollResponse.data.data;
                    
                    // Group payroll data by month
                    const monthlyData = payrollData.reduce((acc, curr) => {
                        const date = new Date(curr.SalaryMonth);
                        const monthKey = date.toLocaleString('vi-VN', { month: 'short', year: 'numeric' });
                        
                        if (!acc[monthKey]) {
                            acc[monthKey] = {
                                baseSalary: 0,
                                bonus: 0,
                                deductions: 0,
                                netSalary: 0,
                                employeeCount: new Set()
                            };
                        }
                        
                        acc[monthKey].baseSalary += curr.BaseSalary || 0;
                        acc[monthKey].bonus += curr.Bonus || 0;
                        acc[monthKey].deductions += curr.Deductions || 0;
                        acc[monthKey].netSalary += curr.NetSalary || 0;
                        if (curr.employee?.EmployeeID) {
                            acc[monthKey].employeeCount.add(curr.employee.EmployeeID);
                        }
                        
                        return acc;
                    }, {});

                    // Convert to array and sort by date
                    const overviewArray = Object.entries(monthlyData)
                        .map(([month, data]) => ({
                            name: month,
                            "Lương cơ bản": Math.round(data.baseSalary),
                            "Thưởng": Math.round(data.bonus),
                            "Khấu trừ": Math.round(data.deductions),
                            "Thực lãnh": Math.round(data.netSalary),
                            employees: data.employeeCount.size
                        }))
                        .sort((a, b) => {
                            const [monthA, yearA] = a.name.split(" th ");
                            const [monthB, yearB] = b.name.split(" th ");
                            return new Date(yearA, parseInt(monthA) - 1) - new Date(yearB, parseInt(monthB) - 1);
                        });

                    setOverviewData(overviewArray);
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
                    <OverviewChart 
                        data={overviewData} 
                        title="Tổng quan lương theo tháng" 
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;