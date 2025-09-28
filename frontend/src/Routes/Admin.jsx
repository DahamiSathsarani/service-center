import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../Components/Menu Compnents/Navbar";
import Sidebar from "../Components/Menu Compnents/Sidebar";

import UserCreateAndView from "../Components/Forms/UserCreateAndView";
import ProtectedRoutes from "./ProtectedRoutes";
import { get_user_profile_details } from "../Api/UserAPI";
import AdminDashboard from "../Pages/admin/AdminDashboard.";
import AdvisorsViewPage from "../Pages/admin/AdvisorsViewPage";
import CustomerViewPage from "../Pages/advisor/CustomerViewPage";
import CustomersViewPage from "../Pages/admin/CustomersViewPage";
import CustomerCreatePage from "../Pages/advisor/CustomerCreatePage";
import UserProfile from "../Pages/advisor/UserProfile";
import AddNewCustomerPage from "../Pages/advisor/AddNewCustomerPage";
import VehicleViewPage from "../Pages/admin/VehicleViewPage";
import VehicleCreatePage from "../Pages/advisor/VehicleCreatePage";
import VehicleUpdatePage from "../Pages/admin/VehicleUpdatePage";
import ServiceRecordViewPage from "../Pages/admin/ServiceRecordsViewPage";
import FullForm from "../Pages/advisor/FullForm";
import ServiceInventory from "../Pages/admin/ServiceInventoryPage";

export default function Admin() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user role only once
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await get_user_profile_details(0);
        if (response.status === 200) {
          setUserRole(response.data.user.role_id);
        }
      } catch (error) {
        console.log(error.response?.data?.message || "Internal Error");
      } finally {
        setIsLoading(false);
      }
    };
    getUserDetails();
  }, []);
  const navbarRef = useRef(null);
  const handleBackgroundClick = () => {
    if (navbarRef.current) {
      navbarRef.current.closeDropdown(); // Call function inside Navbar
    }
  };
  const toggleSidebar = (state) => {
    setIsSidebarCollapsed(state);
  };

  // 🔹 Show loading state until role is fetched
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Sidebar userType="admin" toggleSidebar={toggleSidebar} />
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20 lg:ml-20" : "ml-20 lg:ml-64"
        }`}
      >
        <Navbar isSidebarCollapsed={isSidebarCollapsed} ref={navbarRef} />
        <div
          className="pl-4 pb-5 px-10 mx-auto w-full min-h-screen pt-[6rem] bg-background"
          onClick={handleBackgroundClick}
        >
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <AdminDashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="advisors"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <AdvisorsViewPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <CustomersViewPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="user/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <UserCreateAndView />
                </ProtectedRoutes>
              }
            />
            <Route
              path="customer/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <CustomerCreatePage userRole="1" />
                </ProtectedRoutes>
              }
            />
            <Route
              path="customer/:customer_id/view"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <CustomerViewPage userRole="1" />
                </ProtectedRoutes>
              }
            />
            <Route
              path="customer/:customer_id/update"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <AddNewCustomerPage userRole="1" />
                </ProtectedRoutes>
              }
            />
            <Route
              path="advisors/profile/:user_id"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <UserProfile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="user/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <UserCreateAndView />
                </ProtectedRoutes>
              }
            />
            <Route
              path="vehicles"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <VehicleViewPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="vehicle/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <VehicleCreatePage userRole={1} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="vehicle/:vehicle_number/update"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <VehicleUpdatePage userRole={1} />
                </ProtectedRoutes>
              }
            />

            <Route
              path="user/profile"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <UserProfile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-records"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <ServiceRecordViewPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/details/2/view"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <FullForm type="2" action="view" />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/details/1/view"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <FullForm type="1" action="view" />
                </ProtectedRoutes>
              }
            />
            <Route 
              path="service-inventory"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={1}>
                  <ServiceInventory />
                </ProtectedRoutes>
              }
            />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
