import PropTypes from 'prop-types';

const AddForm = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    onChange, 
    employee,
    isLoading,
    departments,
    positions,
    genderOptions,
    statusOptions 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border dark:border-slate-700 transition-colors">
                <div className="p-6">
                    <div className="card-header border-b border-slate-300 pb-4 mb-4 dark:border-slate-700">
                        <h2 className="card-title text-xl">Thêm nhân viên mới</h2>
                    </div>
                    
                    <form onSubmit={onSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Personal Information Section */}
                            <div className="col-span-2">
                                <h3 className="text-md font-medium text-slate-900 mb-2 dark:text-slate-50">Thông tin cá nhân</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Họ và tên <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="FullName"
                                    value={employee.FullName || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Giới tính</label>
                                <select
                                    name="Gender"
                                    value={employee.Gender || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    {genderOptions.map(gender => (
                                        <option key={gender} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="DateOfBirth"
                                    value={employee.DateOfBirth ? employee.DateOfBirth.split('T')[0] : ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                />
                            </div>
                            
                            {/* Contact Information Section */}
                            <div className="col-span-2 mt-3">
                                <h3 className="text-md font-medium text-slate-900 mb-2 dark:text-slate-50">Thông tin liên hệ</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="PhoneNumber"
                                    value={employee.PhoneNumber || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={employee.Email || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                    required
                                />
                            </div>
                            
                            {/* Employment Information Section */}
                            <div className="col-span-2 mt-3">
                                <h3 className="text-md font-medium text-slate-900 mb-2 dark:text-slate-50">Thông tin công việc</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Phòng ban</label>
                                <select
                                    name="DepartmentID"
                                    value={employee.DepartmentID || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                >
                                    <option value="">-- Chọn phòng ban --</option>
                                    {departments.map(dept => (
                                        <option key={dept.DepartmentID} value={dept.DepartmentID}>
                                            {dept.DepartmentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Chức vụ</label>
                                <select
                                    name="PositionID"
                                    value={employee.PositionID || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                >
                                    <option value="">-- Chọn chức vụ --</option>
                                    {positions.map(pos => (
                                        <option key={pos.PositionID} value={pos.PositionID}>
                                            {pos.PositionName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Ngày vào làm</label>
                                <input
                                    type="date"
                                    name="HireDate"
                                    value={employee.HireDate ? employee.HireDate.split('T')[0] : ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-1 dark:text-slate-50">Trạng thái</label>
                                <select
                                    name="Status"
                                    value={employee.Status || ''}
                                    onChange={onChange}
                                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-blue-600"
                                >
                                    <option value="">-- Chọn trạng thái --</option>
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
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
                                {isLoading ? 'Đang thêm...' : 'Thêm nhân viên'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

AddForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    employee: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    departments: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired,
    genderOptions: PropTypes.array.isRequired,
    statusOptions: PropTypes.array.isRequired
};

export default AddForm; 