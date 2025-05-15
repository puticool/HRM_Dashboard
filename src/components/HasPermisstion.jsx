import { useAuth } from '@/contexts/auth-context';
import PropTypes from 'prop-types';

const PermissionGuard = ({ resource, action, children }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(resource, action)) {
    return null; // hoặc trả về fallback như <p>Không có quyền</p>
  }

  return <>{children}</>;
};

PermissionGuard.propTypes = {
  resource: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PermissionGuard;