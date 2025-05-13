import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/auth-context";

import { ChevronsLeft, LogOut, Moon, Sun, Bell, Search } from "lucide-react";

import profileImg from "@/assets/profile-image.jpg";
import SearchModal from "@/components/SearchModal";

import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const { logout } = useAuth();
    const [showSearchModal, setShowSearchModal] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleModalSearch = (query) => {
        // Handle search from modal
        console.log("Searching from modal:", query);
        // Redirect to search results page or handle search logic here
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if Ctrl+K (or Cmd+K on Mac) is pressed
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearchModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
                <div className="flex items-center gap-x-3">
                    <button
                        className="btn-ghost size-10"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronsLeft className={collapsed && "rotate-180"} />
                    </button>
                    
                    {/* Desktop Search */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <button 
                                onClick={() => setShowSearchModal(true)}
                                className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-slate-400 transition-colors hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
                            >
                                <Search size={18} />
                                <span className="text-slate-500 dark:text-slate-400">Tìm kiếm...</span>
                                <div className="ml-8 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                                    Ctrl+K
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-x-3">
                    {/* Mobile Search Button */}
                    <button
                        className="btn-ghost size-10 md:hidden"
                        onClick={() => setShowSearchModal(true)}
                    >
                        <Search size={20} />
                    </button>

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

                    <button className="btn-ghost size-10 relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
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

            {/* Search Modal */}
            <SearchModal 
                isOpen={showSearchModal} 
                onClose={() => setShowSearchModal(false)}
                onSearch={handleModalSearch}
            />
        </>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
