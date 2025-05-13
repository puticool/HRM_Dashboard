import { Footer } from "@/layouts/footer";
import api from "@/utils/api";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ReportPage = () => {
    const [reportData, setReportData] = useState({
        total_employees: 0,
        by_department: [],
        by_status: []
    });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/hr/report/employees');
                setReportData(response.data.data);
            } catch (error) {
                console.error("Error fetching employee report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Báo cáo</h1>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="card ">
                        <div className="card-header flex justify-center">
                            <h2 className="card-title text-xl">Tổng số nhân viên: {reportData.total_employees}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Department chart */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Theo phòng ban</h2>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={reportData.by_department}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="DepartmentName"
                                            angle={-45}
                                            textAnchor="end"
                                            height={70}
                                            tick={{ fontSize: 12, fill: '#cbd5e1' }}
                                        />

                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#cbd5e1' }}
                                        />

                                        <Tooltip />

                                        <Legend
                                            wrapperStyle={{ marginTop: 20, textAlign: 'center' }}
                                        />

                                        <Bar
                                            dataKey="Count"
                                            fill="#3b82f6"
                                            name="Số lượng"
                                            radius={[4, 4, 0, 0]} // bo tròn đầu cột cho mềm hơn
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {reportData.by_department.map((dept, index) => (
                                        <div key={index} className="flex justify-between border-b border-slate-200 dark:border-slate-700 py-1">
                                            <span className="font-medium text-slate-900 transition-colors dark:text-slate-50">{dept.DepartmentName}</span>
                                            <span className="font-medium text-slate-900 transition-colors dark:text-slate-50">{dept.Count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status chart */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Theo trạng thái</h2>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={reportData.by_status}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="Count"
                                            nameKey="Status"
                                            label={({ Status, Count }) => `${Status}: ${Count}`}
                                        >
                                            {reportData.by_status.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {reportData.by_status.map((status, index) => (
                                        <div key={index} className="flex justify-between border-b border-slate-200 dark:border-slate-700 py-1">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                ></div>
                                                <span className="font-medium text-slate-900 transition-colors dark:text-slate-50">
                                                    {status.Status}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-900 transition-colors dark:text-slate-50">{status.Count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6">
                <Footer />
            </div>
        </div>
    );
};

export default ReportPage;
