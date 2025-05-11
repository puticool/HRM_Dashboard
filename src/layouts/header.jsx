import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/auth-context";

import { ChevronsLeft, LogOut, Moon, Sun } from "lucide-react";

import profileImg from "@/assets/profile-image.jpg";

import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                
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
                
                <button 
                    className="btn-ghost size-10 text-red-500" 
                    onClick={handleLogout}
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
