import React from 'react';
import { useAuth } from '@/contexts/auth-context';

const PermissionGuard = ({ resource, action, children }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(resource, action)) {
    return null; // hoặc trả về fallback như <p>Không có quyền</p>
  }

  return <>{children}</>;
};

export default PermissionGuard;