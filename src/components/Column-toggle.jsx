import { useState, useCallback, useRef } from 'react';
import { SlidersHorizontal, Check } from "lucide-react";
import PropTypes from 'prop-types';
import { useClickOutside } from "@/hooks/use-click-outside";

const ColumnToggleDropdown = ({ 
    visibleColumns, 
    setVisibleColumns, 
    columns = [] 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Use custom hook for handling click outside to close dropdown
    useClickOutside([dropdownRef], () => {
        if (isOpen) setIsOpen(false);
    });
    
    // Toggle dropdown open/close state
    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);
    
    // Toggle column visibility with useCallback for better performance
    const toggleColumn = useCallback((columnKey, e) => {
        // Prevent event bubbling to avoid toggling on label click
        e.stopPropagation();
        
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, [setVisibleColumns]);
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors dark:bg-slate-900"
                title="Column Visibility"
            >
                <SlidersHorizontal className="w-5 h-5" />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                        <div className="space-y-1">
                            {columns.map((column) => (
                                <div 
                                    key={column.key} 
                                    onClick={(e) => toggleColumn(column.key, e)}
                                    className="flex items-center justify-between text-sm p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-slate-900 dark:text-slate-50"
                                >
                                    <span>{column.label}</span>
                                    <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                                        {visibleColumns[column.key] && <Check size={18} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ColumnToggleDropdown.propTypes = {
    visibleColumns: PropTypes.object.isRequired,
    setVisibleColumns: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    }))
};

export default ColumnToggleDropdown;