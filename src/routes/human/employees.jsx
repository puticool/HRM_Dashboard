import { Footer } from "@/layouts/footer";
import { useState, useEffect } from "react";
import DataTable from "@/components/Table";
import api from "@/utils/api";
import { UserPlus, Edit, Trash } from "lucide-react";
import ExportDropdown from "@/components/Export";
import SearchInput from "@/components/Search";
import ColumnToggleDropdown from "@/components/Column-toggle";
import HasPermission from "@/components/HasPermisstion";
import AddForm from "@/components/Add-form";
import EditForm from "@/components/Edit-form";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import MonthFilter from "@/components/MonthFilter";
import CustomToast from "@/components/CustomToast";



const EmployeesPage = () => {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [editEmployee, setEditEmployee] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
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
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        employeeId: null
    });

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
                    search: searchTerm.trim() || undefined
                }
            });

            if (response.data && response.data.status === 'success') {
                setEmployees(response.data.data || []);
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
                    emp.EmployeeID === editEmployee.EmployeeID ? { ...emp, ...editEmployee } : emp
                );
                setEmployees(updatedEmployees);
                setIsEditModalOpen(false);
                CustomToast.success('Cập nhật nhân viên thành công!');
            } else {
                throw new Error('Failed to update employee');
            }
        } catch (err) {
            console.error('Error updating employee:', err);
            CustomToast.error(err.response?.data?.message || 'Lỗi cập nhật nhân viên. Vui lòng thử lại.');
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

    // Effect to filter employees when search term or selected month changes
    useEffect(() => {
        let filtered = employees;

        // Filter by search term
        if (searchTerm.trim() !== "") {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((employee) => {
                return (
                    (employee.FullName && employee.FullName.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.Email && employee.Email.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.PhoneNumber && employee.PhoneNumber.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.department?.DepartmentName && employee.department.DepartmentName.toLowerCase().includes(lowercasedTerm)) ||
                    (employee.position?.PositionName && employee.position.PositionName.toLowerCase().includes(lowercasedTerm))
                );
            });
        }

        // Filter by month
        if (selectedMonth) {
            filtered = filtered.filter((employee) => {
                if (!employee.HireDate) return false;
                const hireDate = new Date(employee.HireDate);
                return hireDate.getMonth() + 1 === parseInt(selectedMonth);
            });
        }

        setFilteredEmployees(filtered);
        setTotalItems(filtered.length);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, selectedMonth, employees]);

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Initial data loading
    useEffect(() => {
        fetchEmployees();
        fetchDepartmentsAndPositions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle initiating delete
    const handleDeleteClick = (employeeId) => {
        setDeleteConfirmation({
            isOpen: true,
            employeeId: employeeId
        });
    };

    // Handle closing delete confirmation
    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmation({
            isOpen: false,
            employeeId: null
        });
    };

    // Handle employee deletion
    const handleDeleteEmployee = async () => {
        setDeleteLoading(true);
        try {
            const response = await api.delete(`/hr/delete/${deleteConfirmation.employeeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data && response.data.status === 'success') {
                // Remove the employee from the local state
                const updatedEmployees = employees.filter(emp => emp.EmployeeID !== deleteConfirmation.employeeId);
                setEmployees(updatedEmployees);
                CustomToast.success('Xóa nhân viên thành công!');
            } else {
                throw new Error('Failed to delete employee');
            }
        } catch (err) {
            console.error('Error deleting employee:', err);
            CustomToast.error(err.response?.data?.message || 'Không thể xóa. Nhân viên có dữ liệu cổ tức.');
        } finally {
            setDeleteLoading(false);
            handleCloseDeleteConfirm();
        }
    };

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
                        <button 
                            className="p-1 text-green-600 hover:text-green-800" 
                            title="Chỉnh sửa nhân viên" 
                            onClick={() => handleEditClick(row)}
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    </HasPermission>
                    <HasPermission resource="employees" action="delete">
                        <button 
                            className="p-1 text-red-600 hover:text-red-800" 
                            title="Xóa nhân viên"
                            onClick={() => handleDeleteClick(row.EmployeeID)}
                            disabled={deleteLoading}
                        >
                            <Trash className="w-5 h-5" />
                        </button>
                    </HasPermission>
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

            const response = await api.post('/hr/employees/add', payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data && response.data.status === 'success') {
                fetchEmployees(); // Refresh employee list
                CustomToast.success('Thêm nhân viên thành công!');
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
            CustomToast.error(err.response?.data?.message || 'Lỗi thêm nhân viên. Vui lòng thử lại.');
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Danh sách nhân viên</h1>
                <button
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => handleAddClick()}
                >
                    <UserPlus className="w-4 h-4" />
                    Thêm nhân viên
                </button>
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

                <div className="p-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        maxPagesToShow={5}
                        isLoading={loading}
                        showJumpToPage={true}
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

            {/* Add the ConfirmDialog component at the end */}
            <ConfirmDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={handleCloseDeleteConfirm}
                onConfirm={handleDeleteEmployee}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa nhân viên này?"
            />
        </div>
    );
};

export default EmployeesPage;
