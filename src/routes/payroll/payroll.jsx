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


const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0 
    }).format(amount);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const PayrollPage = () => {
    const [loading, setLoading] = useState(true);
    const [payrolls, setPayrolls] = useState([]);
    const [filteredPayrolls, setFilteredPayrolls] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const itemsPerPage = 5;

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        SalaryID: true,
        FullName: true,
        DepartmentName: true,
        PositionName: true,
        SalaryMonth: true,
        BaseSalary: true,
        Bonus: true,
        Deductions: true,
        NetSalary: true,
        Status: true
    });

    // Fetch payroll data from API
    const fetchPayrolls = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await api.get('/pr/payroll');
            
            if (response.data && response.data.status === 'success') {
                setPayrolls(response.data.data);
                setFilteredPayrolls(response.data.data);
            } else {
                throw new Error('Failed to fetch payroll data');
            }
        } catch (err) {
            console.error('Error fetching payrolls:', err);
            setError(err.message || 'An error occurred while fetching payroll data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchPayrolls();
    }, []);

    // Filter payrolls based on search term and selected month
    useEffect(() => {
        let filtered = payrolls;
        
        // Filter by search term
        if (searchTerm.trim() !== "") {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((payroll) => {
                return (
                    (payroll.employee?.FullName && payroll.employee.FullName.toLowerCase().includes(lowercasedTerm)) ||
                    (payroll.employee?.department?.DepartmentName && payroll.employee.department.DepartmentName.toLowerCase().includes(lowercasedTerm)) ||
                    (payroll.employee?.position?.PositionName && payroll.employee.position.PositionName.toLowerCase().includes(lowercasedTerm)) ||
                    (payroll.SalaryID && payroll.SalaryID.toString().includes(lowercasedTerm))
                );
            });
        }
        
        // Filter by month
        if (selectedMonth) {
            filtered = filtered.filter((payroll) => {
                const date = new Date(payroll.SalaryMonth);
                const month = (date.getMonth() + 1).toString();
                return month === selectedMonth;
            });
        }
        
        setFilteredPayrolls(filtered);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [searchTerm, selectedMonth, payrolls]);

    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPayrolls.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);

    // Table columns configuration
    const columns = [
        { 
            key: "SalaryID",
            label: "Mã",
            header: "Mã", 
            accessor: "SalaryID", 
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
            key: "SalaryMonth",
            label: "Tháng lương",
            header: "Tháng lương", 
            accessor: "SalaryMonth",
            className: "whitespace-nowrap",
            render: (row) => formatDate(row.SalaryMonth)
        },
        { 
            key: "BaseSalary",
            label: "Lương cơ bản",
            header: "Lương cơ bản", 
            accessor: "BaseSalary",
            className: "text-right whitespace-nowrap text-blue-600",
            render: (row) => <span className="text-blue-600">{formatCurrency(row.BaseSalary)}</span>

        },
        { 
            key: "Bonus",
            label: "Thưởng",
            header: "Thưởng", 
            accessor: "Bonus",
            className: "text-right whitespace-nowrap text-green-600",
            render: (row) => <span className="text-green-600">{formatCurrency(row.Bonus)}</span>
        },
        { 
            key: "Deductions",
            label: "Khấu trừ",
            header: "Khấu trừ", 
            accessor: "Deductions",
            className: "text-right whitespace-nowrap text-red-600",
            render: (row) => <span className="text-red-600">{formatCurrency(row.Deductions)}</span>
        },
        { 
            key: "NetSalary",
            label: "Thực lãnh",
            header: "Thực lãnh", 
            accessor: "NetSalary",
            className: "text-right whitespace-nowrap text-purple-600",
            render: (row) => <span className="text-purple-600">{formatCurrency(row.NetSalary)}</span>
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
                <h1 className="title">Bảng lương</h1>
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
                        onClick={fetchPayrolls} 
                        className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md flex items-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Thử lại
                    </button>
                </div>
            )}
            
            {/* Summary Cards */}
            <div className="text-center grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4 bg-blue-50 border-blue-100">
                    <h3 className="text-blue-600 font-medium text-sm mb-1">Tổng lương cơ bản</h3>
                    <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(filteredPayrolls.reduce((sum, p) => sum + p.BaseSalary, 0))}
                    </p>
                </div>
                <div className="card p-4 bg-green-50 border-green-100">
                    <h3 className="text-green-600 font-medium text-sm mb-1">Tổng thưởng</h3>
                    <p className="text-xl font-bold text-green-600">
                        {formatCurrency(filteredPayrolls.reduce((sum, p) => sum + p.Bonus, 0))}
                    </p>
                </div>
                <div className="card p-4 bg-green-50 border-green-100">
                    <h3 className="text-red-600 font-medium text-sm mb-1">Tổng khấu trừ</h3>
                    <p className="text-xl font-bold text-red-600">
                        {formatCurrency(filteredPayrolls.reduce((sum, p) => sum + p.Deductions, 0))}
                    </p>
                </div>
                <div className="card p-4 bg-purple-50 border-purple-100">
                    <h3 className="text-purple-600 font-medium text-sm mb-1">Tổng thực lãnh</h3>
                    <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(filteredPayrolls.reduce((sum, p) => sum + p.NetSalary, 0))}
                    </p>
                </div>
            </div>
            
            {/* Table Card */}
            <div className="card">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <ExportDropdown data={filteredPayrolls} filename="payroll_list" />
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
                            placeholder="Tìm kiếm theo tên nhân viên, phòng ban, mã..."
                            className="w-64 md:w-80"
                        />
                    </div>
                </div>
                <DataTable 
                    columns={visibleColumnsData}
                    data={currentItems}
                    isLoading={loading}
                    emptyMessage="Không có dữ liệu bảng lương"
                />
                <div className="card-footer p-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredPayrolls.length}
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

export default PayrollPage;
