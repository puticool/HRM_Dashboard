import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

const SystemNotifications = ({ notifications }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (!notifications.upcoming && !notifications.attendance_warning && !notifications.salary_difference) {
        return null;
    }

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Thông báo hệ thống</h4>
            
            {/* Upcoming Anniversary */}
            {notifications.upcoming && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                        <p className="text-sm text-slate-900 dark:text-white">
                            <span className="font-medium">{notifications.upcoming.FullName}</span> sẽ kỷ niệm{' '}
                            <span className="font-medium">{notifications.upcoming.MilestoneYears} năm</span> làm việc vào ngày{' '}
                            {format(new Date(notifications.upcoming.AnniversaryDate), 'dd/MM/yyyy')}
                        </p>
                    </div>
                </div>
            )}

            {/* Attendance Warning */}
            {notifications.attendance_warning && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                        <p className="text-sm text-slate-900 dark:text-white">
                            <span className="font-medium">{notifications.attendance_warning.FullName}</span> đã nghỉ{' '}
                            <span className="font-medium">{notifications.attendance_warning.TotalLeave} ngày</span> trong tháng{' '}
                            {format(new Date(notifications.attendance_warning.AttendanceMonth), 'MM/yyyy')},{' '}
                            vượt quá giới hạn cho phép ({notifications.attendance_warning.MaxAllowedLeave} ngày)
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Nghỉ phép: {notifications.attendance_warning.LeaveDays} ngày | 
                            Vắng mặt: {notifications.attendance_warning.AbsentDays} ngày
                        </p>
                    </div>
                </div>
            )}

            {/* Salary Difference */}
            {notifications.salary_difference && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                        <p className="text-sm text-slate-900 dark:text-white">
                            <span className="font-medium">{notifications.salary_difference.FullName}</span> có sự thay đổi lương đáng kể
                        </p>
                        <div className="mt-2 space-y-1 text-xs">
                            <p className="text-slate-500 dark:text-slate-400">
                                Tháng trước: {formatCurrency(notifications.salary_difference.PreviousSalary)}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                                Tháng này: {formatCurrency(notifications.salary_difference.CurrentSalary)}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                                Thay đổi: {notifications.salary_difference.PercentageChange.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

SystemNotifications.propTypes = {
    notifications: PropTypes.shape({
        upcoming: PropTypes.shape({
            EmployeeID: PropTypes.number,
            FullName: PropTypes.string,
            MilestoneYears: PropTypes.number,
            AnniversaryDate: PropTypes.string
        }),
        attendance_warning: PropTypes.shape({
            EmployeeID: PropTypes.number,
            FullName: PropTypes.string,
            Department: PropTypes.string,
            Position: PropTypes.string,
            AttendanceMonth: PropTypes.string,
            AbsentDays: PropTypes.number,
            LeaveDays: PropTypes.number,
            TotalLeave: PropTypes.number,
            MaxAllowedLeave: PropTypes.number
        }),
        salary_difference: PropTypes.shape({
            EmployeeID: PropTypes.number,
            FullName: PropTypes.string,
            Department: PropTypes.string,
            Position: PropTypes.string,
            PreviousMonth: PropTypes.string,
            CurrentMonth: PropTypes.string,
            PreviousSalary: PropTypes.string,
            CurrentSalary: PropTypes.string,
            Difference: PropTypes.string,
            PercentageChange: PropTypes.number,
            ThresholdPercent: PropTypes.number
        })
    }).isRequired
};

export default SystemNotifications; 