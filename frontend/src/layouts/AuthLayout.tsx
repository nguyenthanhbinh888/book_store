import React from 'react';
import { Outlet } from 'react-router-dom';

/** Layout đơn giản cho trang Auth — không có Navbar/Footer */
export const AuthLayout: React.FC = () => {
  return <Outlet />;
};
