import { Footer } from "@/layouts/footer";
import { useState, useEffect } from "react";
import DataTable from "@/components/Table";
import api from "@/utils/api";
import { 
  Eye, 
  Edit, 
  Trash,

} from "lucide-react";
import Pagination from "@/components/Pagination";
import ExportDropdown from "@/components/Export";
import SearchInput from "@/components/Search";
import ColumnToggleDropdown from "@/components/Column-toggle";

const EmployeesPage = () => {
    const [loading, setLoading] = useState(true);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        EmployeeID: true,
        FullName: true,
        Gender: true,
        DepartmentName: true,
        PositionName: true,
        PhoneNumber: true,
        Email: true,
        Status: true,
        HireDate: true,
        actions: true
    });

    // Fetch employees data from API
    const fetchEmployees = async () => {
        setLoading(true);

        
        try {
            const response = await api.get('/hr/employees');
            
            if (response.data && response.data.status === 'success') {
                setEmployees(response.data.data);
                setFilteredEmployees(response.data.data);
            } else {
                throw new Error('Failed to fetch employees data');
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Filter employees based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredEmployees(employees);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = employees.filter((employee) => {
                return (
                    (employee.FullName && employee.FullName.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.Email && employee.Email.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.PhoneNumber && employee.PhoneNumber.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.department?.DepartmentName && employee.department.DepartmentName.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.position?.PositionName && employee.position.PositionName.toLowerCase().includes(lowercasedTerm))
                );
            });
            setFilteredEmployees(filtered);
        }
        // Reset to first page when search changes
        setCurrentPage(1);
    }, [searchTerm, employees]);

    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    // Table columns configuration
    const columns = [
        { 
            key: "EmployeeID",
            label: "ID",
            header: "ID", 
            accessor: "EmployeeID", 
            className: "w-16",
            render: (row) => row.EmployeeID
        },
        {   
            key: "FullName",
            label: "Họ và tên",
            header: "Họ và tên",
            accessor: "FullName" 
        },
        { 
            key: "Gender",
            label: "Giới tính",
            header: "Giới tính", 
            accessor: "Gender",
            className: "w-20 text-center" 
        },
        { 
            key: "DepartmentName",
            label: "Phòng ban",
            header: "Phòng ban", 
            accessor: "department.DepartmentName",
            render: (row) => row.department?.DepartmentName || "-"
        },
        { 
            key: "PositionName",
            label: "Chức vụ",
            header: "Chức vụ", 
            accessor: "position.PositionName",
            render: (row) => row.position?.PositionName || "-"
        },
        { 
            key: "PhoneNumber",
            label: "Điện thoại",
            header: "Điện thoại", 
            accessor: "PhoneNumber",
            className: "whitespace-nowrap"
        },
        { 
            key: "Email",
            label: "Email",
            header: "Email", 
            accessor: "Email",
            className: "whitespace-nowrap" 
        },
        { 
            key: "Status",
            label: "Trạng thái",
            header: "Trạng thái", 
            accessor: "Status",
            className: "whitespace-nowrap",
            render: (row) => {
                let bgColor = "bg-gray-100 text-gray-800";
                if (row.Status === "Đang làm việc" || row.Status === "Active") {
                    bgColor = "bg-green-100 text-green-800";
                } else if (row.Status === "Tạm nghỉ" || row.Status === "Inactive") {
                    bgColor = "bg-yellow-100 text-yellow-800";
                } else if (row.Status === "Nghỉ thai sản") {
                    bgColor = "bg-purple-100 text-purple-800";
                }
                
                return (
                    <span className={`px-2 py-1 rounded-full text-xs ${bgColor}`}>
                        {row.Status || "Unknown"}
                    </span>
                );
            }
        },
        { 
            key: "HireDate",
            label: "Ngày vào",
            header: "Ngày vào", 
            accessor: "HireDate",
            className: "whitespace-nowrap",
            render: (row) => row.HireDate ? new Date(row.HireDate).toLocaleDateString('vi-VN') : "-"
        },
        {
            key: "actions",
            label: "Thao tác",
            header: "Thao tác",
            className: "w-24 text-center",
            render: () => (
                <div className="flex items-center justify-center space-x-1">
                    <button className="p-1 text-blue-600 hover:text-blue-800" title="Xem chi tiết">
                        <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-green-600 hover:text-green-800" title="Sửa">
                        <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800" title="Xóa">
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];
    
    // Filter columns based on visibility settings
    const visibleColumnsData = columns.filter(col => visibleColumns[col.key]);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Danh sách nhân viên</h1>
            </div>
            
            
            
            {/* Table Card */}
            <div className="card">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
    <div className="flex gap-2 items-center">
        <ExportDropdown 
            data={filteredEmployees}
            filename="employees_list"
        />
    </div>
    <div className="flex gap-2 items-center">
        <ColumnToggleDropdown
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            columns={columns}
        />
        <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm nhân viên theo tên, email, SĐT, phòng ban..."
            className="w-64 md:w-80"
        />
    </div>
</div>
                <DataTable 
                    columns={visibleColumnsData}
                    data={currentItems}
                    isLoading={loading}
                    emptyMessage="Không có dữ liệu nhân viên"
                />
                
                <div className="card-footer p-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredEmployees.length}
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

export default EmployeesPage;
