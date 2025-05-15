import { Footer } from "@/layouts/footer";
import { useState, useEffect } from "react";
import DataTable from "@/components/Table";
import api from "@/utils/api";
import { 
  UserPlus, 
  Edit, 
  Trash,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import ExportDropdown from "@/components/Export";
import SearchInput from "@/components/Search";
import ColumnToggleDropdown from "@/components/Column-toggle";
import HasPermission from "@/components/HasPermisstion";
import EditForm from "@/components/Add-form";
import AddForm from "@/components/Edit-form";

const EmployeesPage = () => {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [editEmployee, setEditEmployee] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        FullName: "",
        DateOfBirth: "",
        Gender: "",
        PhoneNumber: "",
        Email: "",
        HireDate: "",
        DepartmentID: "",
        PositionID: "",
        Status: "Active"
    });
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [genderOptions, setGenderOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    
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
            const response = await api.get('/hr/employees', {
                params: {
                    page: currentPage,
                    per_page: itemsPerPage,
                    search: searchTerm.trim() || undefined
                }
            });
            
            if (response.data && response.data.status === 'success') {
                setEmployees(response.data.data || []);
                
                // Get total from API response
                const total = response.data.total || 
                             response.data.meta?.total || 
                             response.data.pagination?.total || 
                             response.data.data?.length || 0;
                             
                setTotalItems(total);
            } else {
                throw new Error('Failed to fetch employees data');
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };




    // Fetch departments and positions
    const fetchDepartmentsAndPositions = async () => {
        try {
            const response = await api.get('/hr/get-data-filter');
            
            if (response.data) {
                // Direct access to the data properties as they are at the root level
                if (response.data.departments) {
                    setDepartments(response.data.departments);
                }
                
                if (response.data.positions) {
                    setPositions(response.data.positions);
                }

                if (response.data.gender) {
                    setGenderOptions(response.data.gender);
                }

                if (response.data.status) {
                    setStatusOptions(response.data.status);
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    // Handle opening edit modal
    const handleEditClick = (employee) => {
        setEditEmployee(employee);
        setIsEditModalOpen(true);
    };

    // Handle closing edit modal
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditEmployee(null);
    };

    // Handle employee update
    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        
        try {
            const response = await api.put(`/hr/employees/update/${editEmployee.EmployeeID}`, {
                FullName: editEmployee.FullName,
                DateOfBirth: editEmployee.DateOfBirth,
                Gender: editEmployee.Gender,
                PhoneNumber: editEmployee.PhoneNumber,
                Email: editEmployee.Email,
                HireDate: editEmployee.HireDate,
                DepartmentID: editEmployee.DepartmentID,
                PositionID: editEmployee.PositionID,
                Status: editEmployee.Status
            }, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });

            if (response.data && response.data.status === 'success') {
                // Update the employee in the local state
                const updatedEmployees = employees.map(emp => 
                    emp.EmployeeID === editEmployee.EmployeeID ? {...emp, ...editEmployee} : emp
                );
                setEmployees(updatedEmployees);
                setIsEditModalOpen(false);
            } else {
                throw new Error('Failed to update employee');
            }
        } catch (err) {
            console.error('Error updating employee:', err);
            alert('Failed to update employee. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    // Handle form field changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Effect to fetch employees when pagination parameters change
    useEffect(() => {
        if (currentPage && itemsPerPage) {
            fetchEmployees();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemsPerPage]);
    
    

    // Initial data loading
    useEffect(() => {
        fetchEmployees();
        fetchDepartmentsAndPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate total pages based on total items and items per page
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

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
            render: (row) => (
                <div className="flex items-center justify-center space-x-1">
                    <HasPermission resource="employees" action="read">
                    <button className="p-1 text-blue-600 hover:text-blue-800" title="Xem chi tiết"
                        onClick={() => handleAddClick(row)}
                    >
                        <UserPlus className="w-5 h-5" />
                    </button>
                    </HasPermission>
                    <HasPermission resource="employees" action="read">
                        <button 
                            className="p-1 text-green-600 hover:text-green-800" 
                            title="Chỉnh sửa nhân viên"
                            onClick={() => handleEditClick(row)}
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    </HasPermission>
                    <button className="p-1 text-red-600 hover:text-red-800" title="Xóa">
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];
    
    // Filter columns based on visibility settings
    const visibleColumnsData = columns.filter(col => visibleColumns[col.key]);

    // Handle opening add modal
    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    // Handle closing add modal
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewEmployee({
            FullName: "",
            DateOfBirth: "",
            Gender: "",
            PhoneNumber: "",
            Email: "",
            HireDate: "",
            DepartmentID: "",
            PositionID: "",
            Status: "Active"
        });
    };

    // Handle new employee form field changes
    const handleNewEmployeeChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle adding new employee
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        
        try {
            const payload = {
                FullName: newEmployee.FullName,
                DateOfBirth: newEmployee.DateOfBirth,
                Gender: newEmployee.Gender,
                PhoneNumber: newEmployee.PhoneNumber,
                Email: newEmployee.Email,
                HireDate: newEmployee.HireDate,
                DepartmentID: newEmployee.DepartmentID ? parseInt(newEmployee.DepartmentID) : null,
                PositionID: newEmployee.PositionID ? parseInt(newEmployee.PositionID) : null,
                Status: newEmployee.Status || "Active"
            };
            
            const response = await api.post('/hr/employees/add', payload);

            if (response.data && response.data.status === 'success') {
                // Add the new employee to the local state
                fetchEmployees(); // Refresh employee list
                alert('Thêm nhân viên thành công!');
                setIsAddModalOpen(false);
                // Reset form fields
                setNewEmployee({
                    FullName: "",
                    DateOfBirth: "",
                    Gender: "",
                    PhoneNumber: "",
                    Email: "",
                    HireDate: "",
                    DepartmentID: "",
                    PositionID: "",
                    Status: "Active"
                });
            } else {
                throw new Error(response.data?.message || 'Failed to add employee');
            }
        } catch (err) {
            console.error('Error adding employee:', err);
            alert(`Lỗi: ${err.response?.data?.message || err.message || 'Failed to add employee. Please try again.'}`);
        } finally {
            setAddLoading(false);
        }
    };

    // Handle changing items per page
    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Effect to reset current page when search term changes
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredEmployees(employees);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            console.log(lowercasedTerm);
            const filtered = employees.filter((employee) => {
                return (
                    (employee.FullName && employee.FullName.toLowerCase().includes(lowercasedTerm))  ||
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
            data={employees}
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
                    data={filteredEmployees}
                    isLoading={loading}
                    emptyMessage="Không có dữ liệu nhân viên"
                />
                
                <div className="card-footer p-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
            </div>
            
            <div className="mt-4">
                <Footer />
            </div>

            {/* Edit Employee Modal using the component */}
            <EditForm 
                isOpen={isEditModalOpen}
                onClose={handleCloseModal}
                employee={editEmployee || {}}
                onSubmit={handleUpdateEmployee}
                onChange={handleFormChange}
                isLoading={updateLoading}
                departments={departments}
                positions={positions}
                genderOptions={genderOptions}
                statusOptions={statusOptions}
            />

            {/* Add Employee Modal */}
            <AddForm 
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                employee={newEmployee}
                onSubmit={handleAddEmployee}
                onChange={handleNewEmployeeChange}
                isLoading={addLoading}
                departments={departments}
                positions={positions}
                genderOptions={genderOptions}
                statusOptions={statusOptions}
            />
        </div>
    );
};

export default EmployeesPage;
