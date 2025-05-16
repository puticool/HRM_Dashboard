import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { Clock, CheckCircle2, FileText } from 'lucide-react';

const UserNotifications = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'attendance':
                return <Clock className="h-5 w-5 text-blue-500" />;
            case 'leave':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'payroll':
                return <FileText className="h-5 w-5 text-purple-500" />;
            default:
                return null;
        }
    };

    if (!notifications.length) {
        return null;
    }

    const hasUnreadNotifications = notifications.some(n => !n.read);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Thông báo của bạn</h4>
                {hasUnreadNotifications && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Đánh dấu tất cả đã đọc
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            notification.read
                                ? 'bg-slate-50 dark:bg-slate-800/50'
                                : 'bg-white dark:bg-slate-800'
                        }`}
                        onClick={() => !notification.read && onMarkAsRead(notification.id)}
                    >
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm ${
                                notification.read
                                    ? 'text-slate-600 dark:text-slate-400'
                                    : 'text-slate-900 dark:text-white font-medium'
                            }`}>
                                {notification.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: vi
                                })}
                            </p>
                        </div>
                        {!notification.read && (
                            <span className="size-2 rounded-full bg-blue-500" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

UserNotifications.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['attendance', 'leave', 'payroll']).isRequired,
            createdAt: PropTypes.string.isRequired,
            read: PropTypes.bool.isRequired
        })
    ).isRequired,
    onMarkAsRead: PropTypes.func.isRequired,
    onMarkAllAsRead: PropTypes.func.isRequired
};

export default UserNotifications; 