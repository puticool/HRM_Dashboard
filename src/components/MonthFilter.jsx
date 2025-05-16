import { useState, useCallback, useRef } from 'react';
import { Calendar, Check } from "lucide-react";
import PropTypes from 'prop-types';
import { useClickOutside } from "@/hooks/use-click-outside";

const MonthFilter = ({ selectedMonth, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Generate array of months for the dropdown
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Tháng ${i + 1}`
    }));

    // Use custom hook for handling click outside to close dropdown
    useClickOutside([dropdownRef], () => {
        if (isOpen) setIsOpen(false);
    });
    
    // Toggle dropdown open/close state
    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Handle month selection
    const handleMonthSelect = useCallback((value) => {
        onChange(value);
        setIsOpen(false);
    }, [onChange]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors dark:bg-slate-900"
                title="Month Filter"
            >
                <Calendar className="w-5 h-5" />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                        <div className="space-y-1">
                            <div 
                                onClick={() => handleMonthSelect("")}
                                className="flex items-center justify-between text-sm p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-slate-900 dark:text-slate-50"
                            >
                                <span>Tất cả tháng</span>
                                <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                                    {selectedMonth === "" && <Check size={18} />}
                                </div>
                            </div>
                            {months.map((month) => (
                                <div 
                                    key={month.value}
                                    onClick={() => handleMonthSelect(month.value)}
                                    className="flex items-center justify-between text-sm p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-slate-900 dark:text-slate-50"
                                >
                                    <span>{month.label}</span>
                                    <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                                        {selectedMonth === month.value && <Check size={18} />}
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

MonthFilter.propTypes = {
    selectedMonth: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MonthFilter;