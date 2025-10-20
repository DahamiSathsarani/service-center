import React, { useEffect, useState ,useRef} from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../Components/Menu Compnents/Navbar";
import Sidebar from "../Components/Menu Compnents/Sidebar";

import AdvisorDashboard from "../Pages/advisor/AdvisorDashboard";
import CustomerCreatePage from "../Pages/advisor/CustomerCreatePage";
import CustomerViewPage from "../Pages/advisor/CustomerViewPage";
import CustomerSearchPage from "../Pages/advisor/CustomerSearchPage";
import VehicleSearchPage from "../Pages/advisor/VehicleSearchPage";
import VehicleCreatePage from "../Pages/advisor/VehicleCreatePage";
import VehicleViewPage from "../Pages/advisor/VehicleViewPage";
import UserProfile from "../Pages/advisor/UserProfile";
import VehicleInventory from "../Pages/advisor/VehicleInventory";
import FullForm from "../Pages/advisor/FullForm";
import ServiceRecordCreatePage from "../Pages/advisor/ServiceRecordCreatePage";
import BaySelection from "../Pages/advisor/BaySelection";
import DamageMarkingPage from "../Pages/advisor/DamageMarkingPage";
import LubeManagement from "../Pages/advisor/Bay Pages/LubeManagement";
import UnderWashManagement from "../Pages/advisor/Bay Pages/UnderWashManagement";
import WashManagement from "../Pages/advisor/Bay Pages/WashManagement";
import FinishingManagement from "../Pages/advisor/Bay Pages/FinishingManagement";
import AddNewCustomerPage from "../Pages/advisor/AddNewCustomerPage";
import ProtectedRoutes from "./ProtectedRoutes";
import { get_user_profile_details } from "../Api/UserAPI";
import ServiceInventoriesPage from "../Pages/advisor/ServiceInventoriesPage";
import InspectionBeginPage from "../Pages/advisor/InspectionBeginPage";
import OngoingServicesPage from "../Pages/advisor/OngoingServicesPage";
import ServiceRecordsPage from "../Pages/advisor/ServiceRecordsPage";
import TakePhotoPage from "../Pages/advisor/TakePhotoPage";
import UpdateNewCustomerPage from "../Pages/advisor/UpdateNewCustomerPage";
import MobileNumberPage from "../Pages/advisor/MobileNumberPage";
import OtpVerificationPage from "../Pages/advisor/OtpVerificationPage";

export default function Advisor() {
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
      <Sidebar userType="advisor" toggleSidebar={toggleSidebar} />
      <div
        className={`transition-all duration-300 ${isSidebarCollapsed ? "ml-20 lg:ml-20" : "ml-20 lg:ml-64"}`}
      >
        <Navbar isSidebarCollapsed={isSidebarCollapsed} ref={navbarRef}  />
        <div
          className="pl-4 pb-5 px-10 mx-auto w-full min-h-screen pt-[6rem] bg-background"
          onClick={handleBackgroundClick}
        >
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <AdvisorDashboard />
                </ProtectedRoutes>
              }
            />

            <Route
              path="ongoing-services"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <OngoingServicesPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="vehicle/search"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <VehicleSearchPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/customer/:customer_id/vehicle/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <VehicleCreatePage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="vehicle/:vehicle_number/view"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <VehicleViewPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="customer/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <CustomerCreatePage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="customer/mobile-number"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <MobileNumberPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="customer/otp-verification"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <OtpVerificationPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="customer/:vehicle_number/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <AddNewCustomerPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="customer/:customer_id/view"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <CustomerViewPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="customer/:vehicle_number/update/:customer_id"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <UpdateNewCustomerPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/:service_no/vehicleinventory/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <VehicleInventory type="create" />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/:service_no/vehicleinventory/update"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <VehicleInventory type="update" />
                </ProtectedRoutes>
              }
            />

            <Route
              path="customer/search"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <CustomerSearchPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="user/profile"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <UserProfile />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/:vehicle_number/service-record/create"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <ServiceRecordCreatePage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="service-record/:service_no/damage-marking"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <DamageMarkingPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="service-record/:service_no/take-photo"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <TakePhotoPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/service-record/:record_id/service-inventory"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <InspectionBeginPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="service-record/:record_id/details/1"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <FullForm type="1" />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/details/1/view"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <FullForm type="1" action="view" />
                </ProtectedRoutes>
              }
            />

            <Route
              path="service-record/:record_id/details/2/"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <FullForm type="2" />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/details/2/view"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <FullForm type="2" action="view" />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/bay-selection"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <BaySelection />
                </ProtectedRoutes>
              }
            />

            <Route
              path="service-record/:record_id/bay-selection/lube"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <LubeManagement />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/bay-selection/wash"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <WashManagement />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/bay-selection/uwash"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <UnderWashManagement />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-record/:record_id/bay-selection/finishing"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <FinishingManagement />
                </ProtectedRoutes>
              }
            />

            <Route
              path="service-inventories"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <ServiceInventoriesPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="service-records"
              element={
                <ProtectedRoutes userRole={userRole} checkedRole={2}>
                  <ServiceRecordsPage />
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
