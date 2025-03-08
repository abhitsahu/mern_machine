import { createContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ user, token, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
