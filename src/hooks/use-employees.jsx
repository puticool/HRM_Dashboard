import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Get unique departments from employees
  const departments = [...new Set(employees.map(emp => emp.department?.DepartmentName).filter(Boolean))];
  
  // Get unique statuses from employees
  const statuses = [...new Set(employees.map(emp => emp.Status).filter(Boolean))];

  // Fetch employees data
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/hr/employees');
      
      if (response.data && response.data.status === 'success') {
        setEmployees(response.data.data);
        setFilteredEmployees(response.data.data);
      } else {
        throw new Error('Failed to fetch employees data');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'An error occurred while fetching employees');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch data
  const refreshEmployees = () => {
    fetchEmployees();
  };

  // Apply filters when filter conditions change
  useEffect(() => {
    let filtered = [...employees];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(employee => 
        (employee.FullName?.toLowerCase().includes(query)) ||
        (employee.Email?.toLowerCase().includes(query)) ||
        (employee.PhoneNumber?.includes(query)) ||
        (employee.EmployeeID?.toString().includes(query)) ||
        (employee.department?.DepartmentName?.toLowerCase().includes(query)) ||
        (employee.position?.PositionName?.toLowerCase().includes(query))
      );
    }
    
    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter(employee => 
        employee.department?.DepartmentName === departmentFilter
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(employee => 
        employee.Status === statusFilter
      );
    }
    
    setFilteredEmployees(filtered);
  }, [searchQuery, departmentFilter, statusFilter, employees]);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    filteredEmployees,
    loading,
    error,
    refreshEmployees,
    departments,
    statuses,
    filters: {
      searchQuery,
      setSearchQuery,
      departmentFilter,
      setDepartmentFilter,
      statusFilter,
      setStatusFilter
    }
  };
}; 