import { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/utils/cn";

import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";

import { Home, FileText, Bell, Users, CreditCard, User, Calendar } from "lucide-react";

import HasPermission from "@/components/HasPermisstion";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex gap-x-3 p-3">
                <img
                    src={logoLight}
                    alt="Logoipsum"
                    className="dark:hidden"
                />
                <img
                    src={logoDark}
                    alt="Logoipsum"
                    className="hidden dark:block"
                />
                {!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">Dashboard</p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                <a href="/" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                    <Home className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Trang chủ</span>}
                </a>
                <a href="/report" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                    <FileText className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Báo cáo</span>}
                </a>
                <a href="/notification" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                    <Bell className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Thông báo</span>}
                </a>
                <div className="sidebar-group">
                    <HasPermission resource="employees" action="read">
                        {!collapsed && <h3 className="sidebar-group-title">Quản lý nhân viên</h3>}
                        <a href="/human" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                            <Users className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Danh sách nhân viên</span>}
                        </a>
                    </HasPermission>
                </div>
                
                <div className="sidebar-group">
                    <HasPermission resource="salaries" action="read">
                        {!collapsed && <h3 className="sidebar-group-title">Quản lý lương</h3>}
                        <a href="/payroll" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                            <CreditCard className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Bảng lương</span>}
                        </a>
                    </HasPermission>
                </div>
                
                <div className="sidebar-group">
                    <HasPermission resource="users" action="read">
                        {!collapsed && <h3 className="sidebar-group-title">Quản lý người dùng</h3>}
                        <a href="/users" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                            <Users className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Người dùng</span>}
                        </a>
                    </HasPermission>
                </div>
                
                <div className="sidebar-group">
                    <HasPermission resource="salary" action="read">
                        {!collapsed && <h3 className="sidebar-group-title">Thông tin cá nhân</h3>}
                        <a href="/my-payroll" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                            <User className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Bảng lương cá nhân</span>}
                        </a>
                    </HasPermission>
                </div>
                
                <div className="sidebar-group">
                    <HasPermission resource="attendances" action="read">
                        {!collapsed && <h3 className="sidebar-group-title">Quản lý chấm công</h3>}
                        <a href="/attendance" className={cn("sidebar-item", collapsed && "md:justify-center")}>
                            <Calendar className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Bảng chấm công</span>}
                        </a>
                    </HasPermission>
                </div>
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
