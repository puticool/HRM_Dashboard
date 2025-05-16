import PropTypes from 'prop-types';
import SystemNotifications from './SystemNotifications';
import UserNotifications from './UserNotifications';

const NotificationDropdown = ({ notifications, isOpen, onMarkAsRead, onMarkAllAsRead }) => {
    if (!isOpen) return null;

    const hasNotifications = Boolean(
        notifications.upcoming || 
        notifications.attendance_warning || 
        notifications.salary_difference ||
        notifications.oldNotifications.length > 0
    );

    return (
        <div className="absolute right-0 mt-2 w-96 rounded-lg bg-white shadow-lg dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="max-h-[80vh] overflow-y-auto">
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Thông báo</h3>
                    
                    <div className="space-y-4">
                        <SystemNotifications notifications={notifications} />
                        <UserNotifications 
                            notifications={notifications.oldNotifications}
                            onMarkAsRead={onMarkAsRead}
                            onMarkAllAsRead={onMarkAllAsRead}
                        />

                        {!hasNotifications && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                                Không có thông báo mới
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

NotificationDropdown.propTypes = {
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
        }),
        oldNotifications: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                title: PropTypes.string.isRequired,
                message: PropTypes.string.isRequired,
                type: PropTypes.oneOf(['attendance', 'leave', 'payroll']).isRequired,
                createdAt: PropTypes.string.isRequired,
                read: PropTypes.bool.isRequired
            })
        ).isRequired
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onMarkAsRead: PropTypes.func.isRequired,
    onMarkAllAsRead: PropTypes.func.isRequired
};

export default NotificationDropdown;