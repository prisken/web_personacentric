import React from 'react';
import { useUser } from '../../contexts/UserContext';

const RoleGuard = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useUser();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }
  
  return children;
};

export default RoleGuard;
