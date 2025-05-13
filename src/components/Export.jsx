import { useState, useRef, useEffect, useCallback } from 'react';
import { FileDown, ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const ExportDropdown = ({ data, filename = "export" }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const downloadFile = useCallback((content, fileType, fileExtension) => {
        const blob = new Blob([content], { type: fileType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().slice(0,10)}.${fileExtension}`;
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);
    }, [filename]);

    const prepareExportData = useCallback((delimiter) => {
        if (!data || !data.length) {
            throw new Error("No data to export");
        }

        const headers = Object.keys(data[0]);
        
        return [
            headers.join(delimiter),
            ...data.map(item => {
                return headers.map(header => {
                    const value = item[header] ?? '';
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(delimiter);
            })
        ].join('\n');
    }, [data]);

    // Function to export data to CSV
    const exportToCSV = useCallback(() => {
        try {
            const csvContent = prepareExportData(',');
            downloadFile(csvContent, 'text/csv;charset=utf-8;', 'csv');
            toast.success("Data exported successfully as CSV!");
            setShowDropdown(false);
        } catch (error) {
            toast.error("Failed to export data");
            console.error("Export error:", error);
        }
    }, [prepareExportData, downloadFile]);

    // Function to export data to Excel (XLSX)
    const exportToExcel = useCallback(() => {
        try {
            const excelContent = prepareExportData(';');
            downloadFile(excelContent, 'application/vnd.ms-excel', 'xls');
            toast.success("Data exported successfully as Excel!");
            setShowDropdown(false);
        } catch (error) {
            toast.error("Failed to export data");
            console.error("Export error:", error);
        }
    }, [prepareExportData, downloadFile]);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(prevState => !prevState);
    }, []);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors border border-slate-300 dark:border-slate-700"
                title="Export"
            >
                <FileDown size={16} />
                Export
                <ChevronDown size={14} />
            </button>
            
            {showDropdown && (
                <div className="absolute left-0 mt-2 w-36 dark:bg-slate-900 bg-white rounded-md shadow-lg z-10 border border-slate-300">
                    <ul className="py-1">
                        <li>
                            <button 
                                onClick={exportToCSV}
                                className="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                CSV Format
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={exportToExcel}
                                className="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Excel Format
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

ExportDropdown.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    filename: PropTypes.string
};

export default ExportDropdown;