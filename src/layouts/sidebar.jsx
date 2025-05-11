import { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/utils/cn";

import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";

import { useAuth } from "@/contexts/auth-context";
import HasPermission from "@/components/HasPermisstion";
import profileImg from "@/assets/profile-image.jpg";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { user } = useAuth();
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
                {user && (

                    <div className="flex items-center gap-x-3">
                        <div className="relative">
                            <button className="flex items-center gap-x-1">
                                <div className="size-10 overflow-hidden rounded-full">
                                    <img
                                        src={profileImg}
                                        alt="profile image"
                                        className="size-full object-cover"
                                    />
                                </div>
                            </button>
                        </div>
                        <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">{user.username}</p>
                    </div>
                )}
                <HasPermission resource="employees" action="read">
                    <p>Chỉnh sửa nhân viên</p>
                </HasPermission>
                <HasPermission resource="employeesaaaaaa" action="read">
                    <p>Chỉnh sửa nhân viên</p>
                </HasPermission>

            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
