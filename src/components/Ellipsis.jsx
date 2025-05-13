import { useState, useEffect, useRef } from 'react';
import { Ellipsis } from 'lucide-react';
import PropTypes from 'prop-types';

const EllipsisDropdown = ({ 
  options = [],
  position = "right", // right, left, center
  buttonSize = 20
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleOptionClick = (e, handler) => {
    e.stopPropagation();
    handler();
    setIsOpen(false);
  };
  
  // Calculate position class
  const getPositionClass = () => {
    switch (position) {
      case "left": return "left-0";
      case "center": return "left-1/2 transform -translate-x-1/2";
      default: return "right-0";
    }
  };
  
  return (
    <div ref={dropdownRef}>
      <button
        className="text-slate-900 dark:text-slate-50"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Menu options"
      >
        <Ellipsis size={buttonSize} />
      </button>
      
      {isOpen && (
        <div className={`absolute ${getPositionClass()} mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-gray-700`}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => handleOptionClick(e, option.handler)}
              className={`w-full text-left px-4 py-2 text-sm ${option.className || 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

EllipsisDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
      icon: PropTypes.node,
      className: PropTypes.string
    })
  ),
  position: PropTypes.oneOf(['right', 'left', 'center']),
  buttonSize: PropTypes.number
};

export default EllipsisDropdown;