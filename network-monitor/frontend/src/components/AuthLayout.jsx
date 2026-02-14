import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useNetworkStore from '../store/useNetworkStore';

const AuthLayout = () => {
  const isAuthenticated = useNetworkStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
