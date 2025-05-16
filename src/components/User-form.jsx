import PropTypes from 'prop-types';

const UserForm = ({ 
    isOpen, 
    onClose, 
    user, 
    onSubmit, 
    onChange, 
    isLoading,
    rolesList,
    isNewUser = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border dark:border-slate-700 transition-colors">
                <div className="p-6">
                    <div className="card-header border-b border-slate-300 pb-4 mb-4 dark:border-slate-700">
                        <h2 className="card-title text-xl">{isNewUser ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</h2>
                    </div>
                    
                    <form onSubmit={onSubmit}>
                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">
                                    Tên đăng nhập <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={user.username || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">
                                    Mật khẩu {isNewUser && <span className="text-red-500">*</span>}
                                    {!isNewUser && <span className="text-xs text-slate-500 ml-1">(để trống nếu không muốn thay đổi)</span>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={user.password || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                    required={isNewUser}
                                    minLength={6}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">
                                    ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="id"
                                    value={user.id || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">
                                    Vai trò
                                </label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {rolesList.map(role => {
                                        // Check if user.roles contains this role ID
                                        // This handles both cases - when roles are objects with IDs or when they're direct role IDs
                                        const isSelected = (user.roles || []).some(r => 
                                            typeof r === 'object' && r !== null ? r.id === role.id : r === role.id
                                        );
                                        
                                        const toggleRole = () => {
                                            const currentRoles = [...(user.roles || [])];
                                            let newRoles;
                                            
                                            if (isSelected) {
                                                // Remove role if already selected
                                                newRoles = currentRoles.filter(r => 
                                                    typeof r === 'object' && r !== null ? r.id !== role.id : r !== role.id
                                                );
                                            } else {
                                                // Add role if not selected - always add as role object
                                                newRoles = [...currentRoles, { 
                                                    id: role.id, 
                                                    name: role.name,
                                                    description: role.description 
                                                }];
                                            }
                                            
                                            // Log for debugging
                                            console.log('Current roles:', currentRoles);
                                            console.log('New roles:', newRoles);
                                            
                                            // Update roles
                                            onChange({
                                                target: {
                                                    name: 'roles',
                                                    value: newRoles
                                                }
                                            });
                                        };
                                        
                                        return (
                                            <div 
                                                key={role.id} 
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700' 
                                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                                                }`}
                                                onClick={toggleRole}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="pt-0.5">
                                                        <div 
                                                            className="w-5 h-5 border rounded flex items-center justify-center bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent double triggering
                                                                toggleRole();
                                                            }}
                                                        >
                                                            {isSelected && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-slate-900 dark:text-slate-100">{role.name}</div>
                                                        {role.description && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{role.description}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {rolesList.length === 0 && (
                                    <div className="text-sm text-slate-500 dark:text-slate-400 p-2">Không có vai trò nào</div>
                                )}
                                
                                {/* Selected roles display */}
                                {(user.roles || []).length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Vai trò đã chọn:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {(user.roles || []).map(role => {
                                                // Handle both role objects and direct role IDs
                                                const roleId = typeof role === 'object' && role !== null ? role.id : role;
                                                const roleName = typeof role === 'object' && role !== null ? 
                                                    role.name : 
                                                    rolesList.find(r => r.id === role)?.name || `Role ${role}`;
                                                
                                                return (
                                                    <div 
                                                        key={roleId} 
                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full flex items-center gap-1"
                                                    >
                                                        <span>{roleName}</span>
                                                        <button 
                                                            type="button"
                                                            className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 flex items-center justify-center dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
                                                            onClick={() => {
                                                                const currentRoles = [...(user.roles || [])];
                                                                const newRoles = currentRoles.filter(r => 
                                                                    typeof r === 'object' && r !== null ? 
                                                                        r.id !== roleId : 
                                                                        r !== roleId
                                                                );
                                                                onChange({
                                                                    target: {
                                                                        name: 'roles',
                                                                        value: newRoles
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={user.is_active || false}
                                    onChange={onChange}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 dark:border-slate-600 dark:bg-slate-800"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-slate-900 dark:text-slate-50">
                                    Kích hoạt
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-300 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:text-slate-50 dark:hover:bg-slate-800"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 
                                    (isNewUser ? 'Đang thêm...' : 'Đang lưu...') : 
                                    (isNewUser ? 'Thêm người dùng' : 'Lưu thay đổi')
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

UserForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    rolesList: PropTypes.array.isRequired,
    isNewUser: PropTypes.bool
};

export default UserForm; 