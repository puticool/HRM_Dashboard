import { Footer } from "@/layouts/footer";
import DataTable from "@/components/Table";
import api from "@/utils/api";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import ExportDropdown from "@/components/Export";
import SearchInput from "@/components/Search";
import ColumnToggleDropdown from "@/components/Column-toggle";
import { UserPlus, Edit, Trash } from "lucide-react";
import UserForm from "@/components/User-form";

const UsersPage = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        is_active: true,
        id  : null,
        roles: [],
    });
    const [rolesList, setRolesList] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        username: true,
        is_active: true,
        created_at: true,
        roles: true,
        actions: true
    });

    // Define table columns
    const columns = [
        { 
            key: "id",
            label: "ID",
            header: "ID", 
            accessor: "id", 
            className: "w-16"
        },
        {   
            key: "username",
            label: "Tên",
            header: "Tên",
            accessor: "username" 
        },
        { 
            key: "is_active",
            label: "Trạng thái",
            header: "Trạng thái", 
            accessor: "is_active",
            className: "whitespace-nowrap",
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
            )
        },
        { 
            key: "created_at",
            label: "Ngày tạo",
            header: "Ngày tạo", 
            accessor: "created_at",
            className: "whitespace-nowrap",
            render: (row) => formatDate(row.created_at)
        },
        { 
            key: "roles",
            label: "Vai trò",
            header: "Vai trò", 
            accessor: "roles",
            render: (row) => {
                if (!row.roles || !Array.isArray(row.roles)) return "";
                
                return row.roles.map(role => {
                    if (typeof role === 'object' && role !== null) {
                        // For standard role objects with name property
                        return role.name;
                    } else {
                        // For direct role IDs, look up in rolesList using the predefined roles
                        const roleInfo = rolesList.find(r => r.id === role);
                        if (roleInfo) {
                            return roleInfo.name;
                        }
                        
                        // Fallback based on known role IDs if not found in rolesList
                        switch(role) {
                            case 1: return "root_admin";
                            case 2: return "payroll_admin";
                            case 3: return "human_admin";
                            case 4: return "user";
                            default: return `Role ${role}`;
                        }
                    }
                }).join(", ");
            }
        },
        {
            key: "actions",
            label: "Thao tác",
            header: "Thao tác",
            className: "w-24 text-center",
            render: (row) => (
                <div className="flex items-center justify-center space-x-1">
                    <button 
                        className="p-1 text-blue-600 hover:text-blue-800" 
                        title="Chỉnh sửa người dùng"
                        onClick={() => handleEditClick(row)}
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button 
                        className="p-1 text-red-600 hover:text-red-800" 
                        title="Xóa người dùng"
                        onClick={() => handleDeleteClick(row)}
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };
    // Handle edit user
    const handleEditClick = (user) => {
        setEditUser({...user});
        setIsEditModalOpen(true);
    };

    // Handle edit modal close
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditUser(null);
    };

    // Handle edit form change
    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setEditUser(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name === 'roles') {
            // Direct assignment for new role selection interface
            setEditUser(prev => ({
                ...prev,
                roles: value // Value is already an array of role objects
            }));
            console.log('Updated roles:', value);
        } else {
            setEditUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle update user
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            // Extract role IDs from the selected roles
            const roleIds = editUser.roles.map(role => 
                typeof role === 'object' && role !== null ? role.id : role
            );
            
            const response = await api.put(`/user/info/${editUser.id}`, {
                username: editUser.username,
                is_active: editUser.is_active,
                role_ids: roleIds
            });

            if (response.data && response.data.status === 'success') {
                // Create an updated user with the correct structure
                const updatedUser = {...editUser};
                
                // Handle API response for roles
                if (response.data.data && response.data.data.roles) {
                    const apiRoles = response.data.data.roles;
                    
                    // If roles are returned as IDs, convert them to the proper structure
                    if (Array.isArray(apiRoles) && apiRoles.length > 0 && typeof apiRoles[0] !== 'object') {
                        updatedUser.roles = apiRoles.map(roleId => {
                            // Find the full role information
                            const roleInfo = rolesList.find(r => r.id === roleId);
                            if (roleInfo) {
                                return {
                                    id: roleInfo.id,
                                    name: roleInfo.name,
                                    description: roleInfo.description
                                };
                            }
                            // Fallback if role not found
                            return { id: roleId, name: `Role ${roleId}`, description: "" };
                        });
                    } else {
                        updatedUser.roles = apiRoles;
                    }
                }
                
                const updatedUsers = users.map(user => 
                    user.id === editUser.id ? updatedUser : user
                );
                
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
                setIsEditModalOpen(false);
                alert('Cập nhật người dùng thành công!');
            } else {
                throw new Error('Failed to update user');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Lỗi cập nhật người dùng. Vui lòng thử lại.');
        } finally {
            setUpdateLoading(false);
        }
    };

    // Handle delete user
    const handleDeleteClick = (user) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.username}"?`)) {
            handleDeleteUser(user.id);
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId) => {
        try {
            const response = await api.delete(`/user/info/${userId}`);
            
            if (response.data && response.data.status === 'success') {
                // Remove the user from the local state
                const updatedUsers = users.filter(user => user.id !== userId);
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
                alert('Xóa người dùng thành công!');
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Lỗi xóa người dùng. Vui lòng thử lại.');
        }
    };

    // Handle add user modal
    const handleAddClick = (user) => {
        if (user) {
            // If a user is passed, prefill the form with their data (for cloning)
            setNewUser({
                username: user.username + "_copy",
                password: "",
                is_active: user.is_active,
                id: user.id,
                roles: [...user.roles]
            });
        } else {
            // Reset the form for a new user
            setNewUser({
                username: "",
                password: "",
                is_active: true,
                id: null,
                roles: [],
            });
        }
        setIsAddModalOpen(true);
    };

    // Handle add modal close
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewUser({
            username: "",
            password: "",
            is_active: true,
            roles: [],
        });
    };

    // Handle add form change
    const handleAddFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setNewUser(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name === 'roles') {
            // Direct assignment for new role selection interface
            setNewUser(prev => ({
                ...prev,
                roles: value // Value is already an array of role objects
            }));
            console.log('New user roles:', value);
        } else {
            setNewUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle add user
    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddLoading(true);

        try {
            // Extract role IDs from the selected roles
            const roleIds = newUser.roles.map(role => 
                typeof role === 'object' && role !== null ? role.id : role
            );
            const response = await api.post('/user/create-user', {
                username: newUser.username,
                password: newUser.password,
                is_active: newUser.is_active,
                roles: roleIds,
                id: newUser.id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);

            if (response.data) {
                // Add the new user to the local state
                const createdUser = response.data;
                // The API may return a different role structure than what we use in the UI
                // Ensure we have the proper role structure with name, description, and id
                if (createdUser.roles && Array.isArray(createdUser.roles)) {
                    if (createdUser.roles.length > 0 && typeof createdUser.roles[0] !== 'object') {
                        // If roles are just IDs, convert them to objects using our rolesList
                        createdUser.roles = createdUser.roles.map(roleId => {
                            // Find the full role information from our rolesList
                            const roleInfo = rolesList.find(r => r.id === roleId);
                            if (roleInfo) {
                                return {
                                    id: roleInfo.id,
                                    name: roleInfo.name,
                                    description: roleInfo.description
                                };
                            }
                            // Fallback if role not found
                            return { id: roleId, name: `Role ${roleId}`, description: "" };
                        });
                    }
                }
                
                setUsers(prev => [...prev, createdUser]);
                setFilteredUsers(prev => [...prev, createdUser]);
                setIsAddModalOpen(false);
                setNewUser({
                    username: "",
                    password: "",
                    is_active: true,
                    roles: []
                });
                alert('Thêm người dùng thành công!');
            } else {
                throw new Error('Failed to add user');
            }
        } catch (err) {
            console.error('Error adding user:', err);
            alert(`Lỗi thêm người dùng: ${err.response?.data?.message || err.message}`);
        } finally {
            setAddLoading(false);
        }
    };

    // Filter columns based on visibility settings
    const visibleColumnsData = columns.filter(col => visibleColumns[col.key]);

    // Fetch users data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get("/user/info");
                
                if (response.data.status === "success") {
                    setUsers(response.data.data);
                    setFilteredUsers(response.data.data);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Fetch roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get("/user/permission-role-group-data");
                
                if (response.data.status === "success") {
                    const apiRoles = response.data.data.roles || [];
                    
                    // If API returns no roles, use the predefined roles
                    if (apiRoles.length === 0) {
                        setRolesList([
                            {
                                name: "root_admin",
                                description: "Quản trị viên",
                                id: 1
                            },
                            {
                                name: "payroll_admin",
                                description: "Quản lý bảng lương",
                                id: 2
                            },
                            {
                                name: "user",
                                description: "Nhân viên",
                                id: 3
                            },
                            {
                                name: "human_admin",
                                description: "Quan lý nhân sự",
                                id: 4
                            }
                        ]);
                    } else {
                        setRolesList(apiRoles);
                    }
                } else {
                    console.error("Failed to fetch roles");
                    // Fallback to predefined roles
                    setRolesList([
                        {
                            name: "root_admin",
                            description: "Quản trị viên",
                            id: 1
                        },
                        {
                            name: "payroll_admin",
                            description: "Quản lý bảng lương",
                            id: 2
                        },
                        {
                            name: "user",
                            description: "Nhân viên",
                            id: 3
                        },
                        {
                            name: "human_admin",
                            description: "Quan lý nhân sự",
                            id: 4
                        }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching roles:", err);
                // Fallback to predefined roles on error
                setRolesList([
                    {
                        name: "root_admin",
                        description: "Quản trị viên",
                        id: 1
                    },
                    {
                        name: "payroll_admin",
                        description: "Quản lý bảng lương",
                        id: 2
                    },
                    {
                        name: "user",
                        description: "Nhân viên",
                        id: 3
                    },
                    {
                        name: "human_admin",
                        description: "Quan lý nhân sự",
                        id: 4
                    }
                ]);
            }
        };

        fetchRoles();
    }, []);

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(users);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = users.filter(user => {
                // Check username and ID
                if (
                    user.username.toLowerCase().includes(lowercasedTerm) ||
                    user.id.toString().includes(lowercasedTerm)
                ) {
                    return true;
                }
                
                // Check roles - handle both role objects and direct role IDs
                if (user.roles && Array.isArray(user.roles)) {
                    return user.roles.some(role => {
                        if (typeof role === 'object' && role !== null) {
                            return role.name.toLowerCase().includes(lowercasedTerm);
                        } else {
                            // For direct role IDs, try to find the corresponding role name
                            const roleInfo = rolesList.find(r => r.id === role);
                            return roleInfo ? 
                                roleInfo.name.toLowerCase().includes(lowercasedTerm) : 
                                role.toString().includes(lowercasedTerm);
                        }
                    });
                }
                
                return false;
            });
            setFilteredUsers(filtered);
        }
        setCurrentPage(1);
    }, [searchTerm, users, rolesList]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Người dùng</h1>
                <button 
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => handleAddClick()}
                >
                    <UserPlus className="w-4 h-4" />
                    Thêm người dùng
                </button>
            </div>
            
            <div className="card">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <ExportDropdown data={filteredUsers} filename="users_list" />
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
                            placeholder="Tìm kiếm theo tên đăng nhập, vai trò..."
                            className="w-64 md:w-80"
                        />
                    </div>
                </div>
                <DataTable 
                    columns={visibleColumnsData}
                    data={currentItems}
                    isLoading={loading}
                    emptyMessage="Không có dữ liệu người dùng"
                />
                <div className="card-footer p-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            </div>
            
            <div className="mt-6">
                <Footer />
            </div>

            {/* Edit User Modal */}
            <UserForm 
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                user={editUser || {}}
                onSubmit={handleUpdateUser}
                onChange={handleEditFormChange}
                isLoading={updateLoading}
                rolesList={rolesList}
                isNewUser={false}
            />

            {/* Add User Modal */}
            <UserForm 
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                user={newUser}
                onSubmit={handleAddUser}
                onChange={handleAddFormChange}
                isLoading={addLoading}
                rolesList={rolesList}
                isNewUser={true}
            />
        </div>
    );
};

export default UsersPage;
