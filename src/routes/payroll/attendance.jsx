import { Footer } from "@/layouts/footer";
import { useState, useEffect } from "react";
import DataTable from "@/components/Table";
import api from "@/utils/api";
import { 
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import ExportDropdown from "@/components/Export";
import SearchInput from "@/components/Search";
import ColumnToggleDropdown from "@/components/Column-toggle";
import MonthFilter from "@/components/MonthFilter";


const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const AttendancePage = () => {
    const [loading, setLoading] = useState(true);
    const [attendances, setAttendances] = useState([]);
    const [filteredAttendances, setFilteredAttendances] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const itemsPerPage = 5;

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        AttendanceID: true,
        FullName: true,
        DepartmentName: true,
        PositionName: true,
        AttendanceMonth: true,
        WorkDays: true,
        AbsentDays: true,
        LeaveDays: true,
        Status: true
    });

    // Fetch attendance data from API
    const fetchAttendances = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await api.get('/pr/attendance');
            
            if (response.data && response.data.status === 'success') {
                setAttendances(response.data.data);
                setFilteredAttendances(response.data.data);
            } else {
                throw new Error('Failed to fetch attendance data');
            }
        } catch (err) {
            console.error('Error fetching attendances:', err);
            setError(err.message || 'An error occurred while fetching attendance data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchAttendances();
    }, []);

    // Filter attendances based on search term and selected month
    useEffect(() => {
        let filtered = attendances;

        // Filter by search term
        if (searchTerm.trim() !== "") {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((attendance) => {
                return (
                    (attendance.employee?.FullName && attendance.employee.FullName.toLowerCase().includes(lowercasedTerm)) ||
                    (attendance.employee?.department?.DepartmentName && attendance.employee.department.DepartmentName.toLowerCase().includes(lowercasedTerm)) ||
                    (attendance.employee?.position?.PositionName && attendance.employee.position.PositionName.toLowerCase().includes(lowercasedTerm)) ||
                    (attendance.AttendanceID && attendance.AttendanceID.toString().includes(lowercasedTerm)) ||
                    (attendance.AttendanceMonth && formatDate(attendance.AttendanceMonth).toLowerCase().includes(lowercasedTerm))
                );
            });
        }

        // Filter by month
        if (selectedMonth) {
            filtered = filtered.filter((attendance) => {
                const date = new Date(attendance.AttendanceMonth);
                const month = (date.getMonth() + 1).toString();
                return month === selectedMonth;
            });
        }

        setFilteredAttendances(filtered);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [searchTerm, selectedMonth, attendances]);

    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAttendances.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAttendances.length / itemsPerPage);

    // Table columns configuration
    const columns = [
        { 
            key: "AttendanceID",
            label: "Mã",
            header: "Mã", 
            accessor: "AttendanceID", 
            className: "w-16 text-center"
        },
        { 
            key: "FullName",
            label: "Nhân viên",
            header: "Nhân viên", 
            accessor: "employee.FullName",
            render: (row) => row.employee?.FullName || "-"
        },
        { 
            key: "DepartmentName",
            label: "Phòng ban",
            header: "Phòng ban", 
            accessor: "employee.department.DepartmentName",
            render: (row) => row.employee?.department?.DepartmentName || "-"
        },
        { 
            key: "PositionName",
            label: "Chức vụ",
            header: "Chức vụ", 
            accessor: "employee.position.PositionName",
            render: (row) => row.employee?.position?.PositionName || "-"
        },
        { 
            key: "AttendanceMonth",
            label: "Tháng chấm công",
            header: "Tháng chấm công", 
            accessor: "AttendanceMonth",
            className: "whitespace-nowrap",
            render: (row) => formatDate(row.AttendanceMonth)
        },
        { 
            key: "WorkDays",
            label: "Ngày làm việc",
            header: "Ngày làm việc", 
            accessor: "WorkDays",
            className: "text-center whitespace-nowrap text-blue-600",
            render: (row) => <span className="text-blue-600">{row.WorkDays}</span>
        },
        { 
            key: "AbsentDays",
            label: "Ngày vắng",
            header: "Ngày vắng", 
            accessor: "AbsentDays",
            className: "text-center whitespace-nowrap text-red-600",
            render: (row) => <span className="text-red-600">{row.AbsentDays}</span>
        },
        { 
            key: "LeaveDays",
            label: "Ngày nghỉ phép",
            header: "Ngày nghỉ phép", 
            accessor: "LeaveDays",
            className: "text-center whitespace-nowrap text-yellow-600",
            render: (row) => <span className="text-yellow-600">{row.LeaveDays}</span>
        },
        { 
            key: "Status",
            label: "Trạng thái",
            header: "Trạng thái", 
            accessor: "employee.Status",
            className: "whitespace-nowrap",
            render: (row) => {
                let bgColor = "bg-gray-100 text-gray-800";
                const status = row.employee?.Status;
                
                if (status?.includes("Đang làm việc") || status?.includes("Active")) {
                    bgColor = "bg-green-100 text-green-800";
                } else if (status?.includes("Tạm nghỉ") || status?.includes("nghỉ")) {
                    bgColor = "bg-yellow-100 text-yellow-800";
                } else if (status?.includes("thai sản")) {
                    bgColor = "bg-purple-100 text-purple-800";
                }
                
                return (
                    <span className={`px-2 py-1 rounded-full text-xs ${bgColor}`}>
                        {status || "Unknown"}
                    </span>
                );
            }
        }
    ];

    // Filter columns based on visibility settings
    const visibleColumnsData = columns.filter(col => visibleColumns[col.key]);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Bảng chấm công</h1>
            </div>
            
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-medium">Lỗi tải dữ liệu</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button 
                        onClick={fetchAttendances} 
                        className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md flex items-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Thử lại
                    </button>
                </div>
            )}
            
            {/* Summary Cards */}
            <div className="text-center grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 bg-blue-50 border-blue-100">
                    <h3 className="text-blue-600 font-medium text-sm mb-1">Tổng số ngày làm việc</h3>
                    <p className="text-xl font-bold text-blue-700">
                        {filteredAttendances.reduce((sum, a) => sum + a.WorkDays, 0)} ngày
                    </p>
                </div>
                <div className="card p-4 bg-red-50 border-red-100">
                    <h3 className="text-red-600 font-medium text-sm mb-1">Tổng số ngày vắng</h3>
                    <p className="text-xl font-bold text-red-600">
                        {filteredAttendances.reduce((sum, a) => sum + a.AbsentDays, 0)} ngày
                    </p>
                </div>
                <div className="card p-4 bg-yellow-50 border-yellow-100">
                    <h3 className="text-yellow-400 font-medium text-sm mb-1">Tổng số ngày nghỉ phép</h3>
                    <p className="text-xl font-bold text-yellow-400">
                        {filteredAttendances.reduce((sum, a) => sum + a.LeaveDays, 0)} ngày
                    </p>
                </div>
            </div>
            
            {/* Table Card */}
            <div className="card">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <ExportDropdown data={filteredAttendances} filename="attendance_list" />
                    </div>
                    <div className="flex gap-2 items-center">
                    <MonthFilter
                            selectedMonth={selectedMonth}
                            onChange={setSelectedMonth}
                        />
                        <ColumnToggleDropdown
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                            columns={columns}
                        />
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Tìm kiếm theo tên nhân viên, phòng ban, tháng..."
                            className="w-64 md:w-80"
                        />
                    </div>
                </div>
                <DataTable 
                    columns={visibleColumnsData}
                    data={currentItems}
                    isLoading={loading}
                    emptyMessage="Không có dữ liệu chấm công"
                />
                <div className="card-footer p-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredAttendances.length}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            </div>
            
            <div className="mt-4">
                <Footer />
            </div>
        </div>
    );
};

export default AttendancePage;
