import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth0();
  const isUser = isAuthenticated && user;
  //if`  there is  no user return to navigae
  if (!isUser) {
    return <Navigate to="/login" />;
  }
  return children;
  //now if there is user so return children
};
export default PrivateRoute;
