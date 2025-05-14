import { useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { useNotification } from "@/contexts/notification-context";

const NotificationPage = () => {
    const { 
        notifications, 
        loading, 
        markAsRead, 
        markAllAsRead,
        refresh
    } = useNotification();

    // Refresh notifications when page is loaded
    useEffect(() => {
        refresh();
    }, []);
    
    // Get a placeholder image based on employee ID
    const getEmployeeImage = (employeeId) => {
        // Use employee ID to generate consistent but random-looking images
        const imageId = employeeId % 100;
        const gender = employeeId % 2 === 0 ? 'men' : 'women';
        return `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`;
    };
    
    // Format the anniversary date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title text-2xl font-bold mb-4">Thông Báo Kỷ Niệm Làm Việc</h1>
            
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin h-10 w-10 border-4 border-teal-500 rounded-full border-t-transparent"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🏆</span>
                            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                                Kỷ niệm làm việc sắp tới
                            </h2>
                        </div>
                        <button 
                            className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
                            onClick={markAllAsRead}
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div 
                                    key={notification.EmployeeID} 
                                    className={`p-4 flex items-center gap-4 rounded-lg transition-all duration-300 
                                    ${!notification.read 
                                        ? "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 shadow-md" 
                                        : "bg-gray-50 dark:bg-gray-800/50"
                                    } 
                                    hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transform hover:scale-[1.01]`}
                                    onClick={() => markAsRead(notification.EmployeeID)}
                                >
                                    <div className="relative">
                                        <img 
                                            src={getEmployeeImage(notification.EmployeeID)} 
                                            alt={notification.FullName} 
                                            className="h-16 w-16 rounded-full object-cover border-2 border-teal-300 dark:border-teal-500"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full p-1.5 text-xs shadow-lg">
                                            🏆
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                            <h3 className={`text-lg ${!notification.read ? "font-bold" : "font-medium"} text-gray-900 dark:text-white`}>
                                                {notification.FullName}
                                            </h3>
                                            <span className="text-sm text-blue-600 dark:text-blue-400 mt-1 sm:mt-0">
                                                {formatDate(notification.AnniversaryDate)}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <p className="text-sm text-teal-600 dark:text-teal-400">
                                                <span className="font-semibold">{notification.MilestoneYears}</span> năm làm việc
                                            </p>
                                            {!notification.read && (
                                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                    Mới
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="hidden sm:flex flex-col items-center gap-2">
                                        <button className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-blue-300/50">
                                            🎉
                                        </button>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Chúc mừng</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-16 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="text-4xl mb-3">🏆</div>
                                <p>Không có kỷ niệm làm việc nào sắp tới</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="mt-6">
                <Footer />
            </div>
        </div>
    );
};

export default NotificationPage;
