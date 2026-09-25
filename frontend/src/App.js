import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Advisor from "./Routes/Advisor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./Routes/Admin";
import LoginPage from "./Pages/common/LoginPage";
import ForgotPassword from "./Pages/common/ForgotPassword";
import ResetPassword from "./Pages/common/ResetPassword";
import UnauthorizedPage from "./Pages/common/UnAuthorizedPage";
import { get_user_profile_details } from "./Api/UserAPI";
import GlobalLoader from "./Pages/common/GlobalLoader";
import NotFoundPage from "./Pages/common/NotFoundPage";

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await get_user_profile_details(0);
        console.log("response", response);
        if (response.status === 200 && response.data.user.role_id) {
          setUserRole(response.data.user.role_id);
        } else {
          setUserRole(0);
        }
      } catch (error) {
        console.log(error.response?.data?.message || "Internal Error");
        setUserRole(0);
      } finally {
        setIsAuthChecked(true);
      }
    };

    getUserDetails();
    document.title = process.env.REACT_APP_NAME || "Easy Care Service Center";
  }, []);

  if (!isAuthChecked && userRole === null) return null;

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <GlobalLoader />
      <Routes>
        <Route
          path="/"
          element={
            userRole === 0 ? (
              <Navigate to="/login" replace />
            ) : userRole === 1 ? (
              <Navigate to="/admin" replace />
            ) : userRole === 2 ? (
              <Navigate to="/advisor" replace />
            ) : null
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/advisor/*" element={<Advisor />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
