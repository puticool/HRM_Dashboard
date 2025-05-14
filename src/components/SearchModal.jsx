import { useEffect, useRef, useState } from 'react';
import { Search, X, ChevronRight, ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

// Define navigation with permissions required
const sidebarNavigation = [
  { 
    title: 'Trang chủ', 
    path: '/', 
    icon: 'Home',
    // No permission needed
  },
  { 
    title: 'Báo cáo', 
    path: '/report', 
    icon: 'BarChart',
    // No permission needed
  },
  {
    title: 'Thông báo',
    path: '/notification',
    icon: 'Bell',
    // No permission needed
  },
  { 
    title: 'Quản lý nhân viên',
    children: [
      { 
        title: 'Danh sách nhân viên', 
        path: '/human', 
        icon: 'Users',
        permission: { resource: 'employees', action: 'read' }
      },
      { 
        title: 'Chỉnh sửa nhân viên', 
        path: '/human/edit', 
        icon: 'Edit',
        permission: { resource: 'employees', action: 'write' }
      },
      { 
        title: 'Xoá nhân viên', 
        path: '/human/delete', 
        icon: 'Trash',
        permission: { resource: 'employees', action: 'delete' }
      },
    ]
  },
  {
    title: 'Quản lý lương',
    children: [
      { 
        title: 'Bảng lương', 
        path: '/payroll', 
        icon: 'DollarSign',
        permission: { resource: 'salaries', action: 'read' }
      },
      { 
        title: 'Chỉnh sửa bản lương', 
        path: '/payroll/edit', 
        icon: 'Edit',
        permission: { resource: 'salaries', action: 'write' }
      },
      { 
        title: 'Xoá bản lương', 
        path: '/payroll/delete', 
        icon: 'Trash',
        permission: { resource: 'salaries', action: 'delete' }
      },
    ]
  },
  {
    title: 'Thông tin cá nhân',
    children: [
      { 
        title: 'Bảng lương cá nhân', 
        path: '/my-payroll', 
        icon: 'CreditCard',
        permission: { resource: 'salary', action: 'read' }
      },
      { 
        title: 'Thông tin cá nhân', 
        path: '/profile', 
        icon: 'User',
        permission: { resource: 'user', action: 'read' }
      },
      { 
        title: 'Tài khoản cá nhân', 
        path: '/account', 
        icon: 'Settings',
        permission: { resource: 'user', action: 'read' }
      },
      { 
        title: 'Chỉnh sửa tài khoản cá nhân', 
        path: '/account/edit', 
        icon: 'Edit',
        permission: { resource: 'user', action: 'write' }
      },
    ]
  },
  {
    title: 'Quản lý chấm công',
    children: [
      { 
        title: 'Bảng chấm công', 
        path: '/attendance', 
        icon: 'Calendar',
        permission: { resource: 'attendances', action: 'read' }
      },
      { 
        title: 'Cập nhật chấm công', 
        path: '/attendance/update', 
        icon: 'Edit',
        permission: { resource: 'attendances', action: 'write' }
      },
      { 
        title: 'Xóa chấm công', 
        path: '/attendance/delete', 
        icon: 'Trash',
        permission: { resource: 'attendances', action: 'delete' }
      },
    ]
  },
  {
    title: 'Quản lý người dùng',
    children: [
      { 
        title: 'Người dùng', 
        path: '/users', 
        icon: 'Users',
        permission: { resource: 'users', action: 'read' }
      },
      { 
        title: 'Chỉnh sửa người dùng', 
        path: '/users/edit', 
        icon: 'Edit',
        permission: { resource: 'users', action: 'write' }
      },
      { 
        title: 'Xóa người dùng', 
        path: '/users/delete', 
        icon: 'Trash',
        permission: { resource: 'users', action: 'delete' }
      },
    ]
  }
];

// Flatten navigation for searching with permission filter
const filterAndFlattenNavigation = (nav, hasPermission) => {
  let results = [];
  nav.forEach(item => {
    if (item.children) {
      // Filter children based on permissions
      const childItems = item.children
        .filter(child => !child.permission || hasPermission(child.permission.resource, child.permission.action))
        .map(child => ({
          ...child,
          category: item.title
        }));
      results = [...results, ...childItems];
    } else if (item.path && (!item.permission || hasPermission(item.permission.resource, item.permission.action))) {
      results.push(item);
    }
  });
  return results;
};

// Get accessible navigation grouped by category
const getGroupedNavigation = (nav, hasPermission) => {
  const result = [];
  
  // Add main items without categories
  const mainItems = nav
    .filter(item => !item.children && (!item.permission || hasPermission(item.permission.resource, item.permission.action)))
    .map(item => ({ ...item }));
  
  if (mainItems.length > 0) {
    result.push({
      title: 'Trang chính',
      items: mainItems
    });
  }
  
  // Add items with categories (children)
  nav.forEach(category => {
    if (category.children) {
      const accessibleItems = category.children
        .filter(item => !item.permission || hasPermission(item.permission.resource, item.permission.action))
        .map(item => ({ 
          ...item, 
          category: category.title 
        }));
      
      if (accessibleItems.length > 0) {
        result.push({
          title: category.title,
          items: accessibleItems
        });
      }
    }
  });
  
  return result;
};

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [navigationMode, setNavigationMode] = useState('group'); // 'group' or 'item'
  
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  
  // Get all accessible navigation items grouped by category
  const groupedNavigation = getGroupedNavigation(sidebarNavigation, hasPermission);

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      // Filter navigation by permissions
      const accessibleNavItems = filterAndFlattenNavigation(sidebarNavigation, hasPermission);
      
      // Filter by search query
      const results = accessibleNavItems.filter(item => 
        item.title.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
      
      setSearchResults(results);
      setSelectedIndex(0);
    } else {
      setSearchResults([]);
      // Reset navigation state when clearing search
      setNavigationMode('group');
      setSelectedGroupIndex(0);
      setSelectedItemIndex(0);
    }
  }, [searchQuery, hasPermission]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 10);
      
      // Reset state when opening
      setSearchQuery('');
      setSearchResults([]);
      setNavigationMode('group');
      setSelectedGroupIndex(0);
      setSelectedItemIndex(0);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      // Search results mode
      if (searchQuery.trim() && searchResults.length > 0) {
        switch (e.key) {
          case 'Escape':
            onClose();
            break;
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
            break;
          case 'Enter':
            e.preventDefault();
            if (selectedIndex >= 0) {
              navigateToResult(searchResults[selectedIndex]);
            }
            break;
          default:
            break;
        }
        return;
      }
      
      // Directory browsing mode
      if (!searchQuery.trim()) {
        switch (e.key) {
          case 'Escape':
            if (navigationMode === 'item') {
              // If in item mode, go back to group selection
              setNavigationMode('group');
              e.preventDefault();
            } else {
              onClose();
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (navigationMode === 'group') {
              setSelectedGroupIndex(prev => 
                Math.min(prev + 1, groupedNavigation.length - 1)
              );
            } else {
              setSelectedItemIndex(prev => 
                Math.min(prev + 1, groupedNavigation[selectedGroupIndex].items.length - 1)
              );
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (navigationMode === 'group') {
              setSelectedGroupIndex(prev => Math.max(prev - 1, 0));
            } else {
              setSelectedItemIndex(prev => Math.max(prev - 1, 0));
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (navigationMode === 'group' && groupedNavigation[selectedGroupIndex].items.length > 0) {
              setNavigationMode('item');
              setSelectedItemIndex(0);
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (navigationMode === 'item') {
              setNavigationMode('group');
            }
            break;
          case 'Enter':
            e.preventDefault();
            if (navigationMode === 'group' && groupedNavigation[selectedGroupIndex].items.length > 0) {
              setNavigationMode('item');
              setSelectedItemIndex(0);
            } else if (navigationMode === 'item') {
              navigateToResult(groupedNavigation[selectedGroupIndex].items[selectedItemIndex]);
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedIndex, searchResults, searchQuery, 
      groupedNavigation, selectedGroupIndex, selectedItemIndex, navigationMode]);

  // Scroll selected item into view
  useEffect(() => {
    if (!searchQuery && resultsRef.current) {
      // Group navigation mode
      if (navigationMode === 'group') {
        const selectedGroup = resultsRef.current.querySelector(`[data-group-index="${selectedGroupIndex}"]`);
        if (selectedGroup) {
          selectedGroup.scrollIntoView({ block: 'nearest' });
        }
      } 
      // Item navigation mode
      else if (navigationMode === 'item') {
        const selectedItem = resultsRef.current.querySelector(
          `[data-group-index="${selectedGroupIndex}"] [data-item-index="${selectedItemIndex}"]`
        );
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: 'nearest' });
        }
      }
    } 
    // Search results mode
    else if (searchQuery && resultsRef.current && searchResults.length > 0) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [
    selectedIndex, 
    searchResults, 
    searchQuery,
    navigationMode, 
    selectedGroupIndex, 
    selectedItemIndex
  ]);

  const navigateToResult = (result) => {
    // Navigate to the path
    navigate(result.path);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[10vh] overflow-auto">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-lg shadow-xl border border-slate-300 dark:border-slate-700 transition-all"
      >
        <div className="p-4 border-b border-slate-300 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={20} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm trang..."
              className="w-full h-12 pl-12 pr-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 focus:border-blue-500 dark:focus:border-blue-600 focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                ESC
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>
          </form>
        </div>

        <div className="max-h-[60vh] overflow-y-auto" ref={resultsRef}>
          {searchQuery && searchResults.length > 0 ? (
            <div className="p-2">
              <div className="text-sm text-slate-500 dark:text-slate-400 px-2 py-1">
                Kết quả tìm kiếm
              </div>
              <div className="space-y-1">
                {searchResults.map((result, index) => (
                  <div 
                    key={`${result.path}-${index}`}
                    data-index={index}
                    className={`flex items-center rounded-lg p-2 cursor-pointer ${
                      selectedIndex === index 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => navigateToResult(result)}
                  >
                    <Search size={16} className="text-slate-400 dark:text-slate-500 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-900 dark:text-slate-50 font-medium truncate">
                        {result.title}
                      </div>
                      {result.category && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {result.category}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 ml-2 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : !searchQuery ? (
            <div className="p-2">
              {groupedNavigation.map((group, groupIndex) => (
                <div 
                  key={`group-${groupIndex}`} 
                  className="mb-4" 
                  data-group-index={groupIndex}
                >
                  <div 
                    className={`text-sm font-medium px-2 py-2 mb-1 border-l-2 rounded-l flex items-center justify-between ${
                      navigationMode === 'group' && selectedGroupIndex === groupIndex
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500 dark:border-l-blue-400 text-blue-700 dark:text-blue-300'
                        : 'border-l-transparent text-slate-500 dark:text-slate-400'
                    }`}
                    onClick={() => {
                      setNavigationMode('group');
                      setSelectedGroupIndex(groupIndex);
                    }}
                  >
                    <span>{group.title}</span>
                    {navigationMode === 'group' && selectedGroupIndex === groupIndex && (
                      <span className="text-xs text-blue-500 dark:text-blue-400 mr-1">
                        <ArrowRight size={14} />
                      </span>
                    )}
                  </div>
                  <div className={`space-y-1 pl-3 border-l-2 ml-2 ${
                    navigationMode === 'group' && selectedGroupIndex === groupIndex
                      ? 'border-l-blue-500 dark:border-l-blue-400' 
                      : 'border-l-slate-200 dark:border-l-slate-700'
                  }`}>
                    {group.items.map((item, itemIndex) => (
                      <div 
                        key={`${group.title}-${itemIndex}`}
                        data-item-index={itemIndex}
                        className={`flex items-center rounded-lg p-2 cursor-pointer ${
                          navigationMode === 'item' && 
                          selectedGroupIndex === groupIndex && 
                          selectedItemIndex === itemIndex
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        onClick={() => navigateToResult(item)}
                        onMouseEnter={() => {
                          if (navigationMode === 'item' && selectedGroupIndex === groupIndex) {
                            setSelectedItemIndex(itemIndex);
                          }
                        }}
                      >
                        <div className="flex-1 min-w-0 pl-2">
                          <div className={`font-medium ${
                            navigationMode === 'item' && 
                            selectedGroupIndex === groupIndex && 
                            selectedItemIndex === itemIndex
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-slate-900 dark:text-slate-50'
                          }`}>
                            {item.title}
                          </div>
                        </div>
                        <ChevronRight size={16} className={`ml-2 ${
                          navigationMode === 'item' && 
                          selectedGroupIndex === groupIndex && 
                          selectedItemIndex === itemIndex
                            ? 'text-blue-500 dark:text-blue-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
              Không tìm thấy kết quả phù hợp
            </div>
          ) : null}
          
          {user && (
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Vai trò: {user.roles.map(role => role.name).join(', ')}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs rounded-b-lg">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-slate-500 dark:text-slate-400">
            <span>Điều hướng:</span>
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 bg-white dark:bg-slate-900">
              <kbd>↑</kbd><kbd>↓</kbd>
            </div>
            <span>lên xuống,</span>
            
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 bg-white dark:bg-slate-900">
              <kbd>←</kbd><kbd>→</kbd>
            </div>
            <span>trái phải,</span>
            
            <div className="border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 bg-white dark:bg-slate-900">
              <kbd>Enter</kbd>
            </div>
            <span>chọn,</span>
            
            <div className="border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 bg-white dark:bg-slate-900">
              <kbd>Esc</kbd>
            </div>
            <span>quay lại/đóng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired
};

export default SearchModal;