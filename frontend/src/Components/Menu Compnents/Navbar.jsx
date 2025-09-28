import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../assets/Images/images";
import { removeAuthToken } from "../../Helpers/LocalStorage";
import { get_user_profile_details } from "../../Api/UserAPI";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../../Api/NotificationAPI";

const Navbar = forwardRef((isSidebarCollapsed, ref) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowDropdown, setIsShowDropdown] = useState(false);

  useEffect(() => {
    getUserDetails();
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const clickLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  const getUserDetails = async () => {
    try {
      const response = await get_user_profile_details(0);
      if (response.status === 200) {
        setUserData(response.data.user);
        setUserRole(response.data.user.role_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onClickProfile = () => {
    setIsShowDropdown(!isShowDropdown);
  };
  useImperativeHandle(ref, () => ({
    closeDropdown: onCLickNavBar,
  }));
  const onCLickNavBar = () => {
    setIsShowDropdown(false);
    setShowNotifications(false);
  };
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      console.log("Fetched Notifications:", data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
      console.log("Fetched Notifications count:", count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleBellIconClick = async () => {
    try {
      await fetchNotifications();
      await fetchUnreadCount();
      setShowNotifications(!showNotifications);
    } catch (error) {
      console.error("Error handling bell icon click:", error);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      console.log("Handling notification click:", id); // Debugging log
      await markNotificationAsRead(id);

      // Update the notifications state locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true } // Mark as read
            : notification
        )
      );

      // Update the unread count locally
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <nav
      ref={ref}
      className={`fixed top-0 left-0 w-full bg-white flex items-center p-4 z-40 transition-all duration-300 ${
        isSidebarCollapsed ? "pl-20" : "pl-64"
      }`}
      onClick={onCLickNavBar}
    >
      <div className="w-full flex justify-between items-center px-4">
        <span className="text-black text-lg font-bold">
          Hello {userData ? userData?.first_name : "Loading..."}
        </span>

        <div
          className="flex items-center space-x-6"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            className="relative text-primary text-2xl"
            onClick={handleBellIconClick}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-64 max-h-64 overflow-y-auto">
              {isLoading ? (
                <p className="p-3 text-sm text-gray-500">
                  Loading notifications...
                </p>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-200 ${
                      !notification.is_read ? "bg-gray-50" : ""
                    }`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                    {!notification.is_read && (
                      <button
                        className="mt-2 text-xs text-blue-500 hover:text-blue-700"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-gray-500">No notifications</p>
              )}
            </div>
          )}

          <div className="relative group" onClick={(e) => e.stopPropagation()}>
            <button
              className="flex items-center space-x-2"
              onClick={onClickProfile}
            >
              <img
                src={userData ? userData.profile_picture : images.ProPic}
                alt="Profile"
                className="rounded-full object-cover"
                style={{ width: "50px", height: "50px" }}
              />
              <span className="font-medium hidden md:inline">
                {userData
                  ? `${userData?.first_name} ${userData?.last_name}`
                  : "Loading..."}
              </span>
            </button>

            <ul
              className={`${
                isShowDropdown ? "" : "hidden"
              } absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2`}
            >
              <li>
                {userRole === 2 ? (
                  <Link
                    to="/advisor/user/profile"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaUserCircle className="mr-2" />
                    Profile
                  </Link>
                ) : userRole === 1 ? (
                  <Link
                    to="/admin/user/profile"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaUserCircle className="mr-2" />
                    Admin Profile
                  </Link>
                ) : null}
              </li>
              <li>
                <hr className="my-1 border-gray-200" />
              </li>
              <li>
                <button
                  className="w-full flex items-center px-3 py-2 text-red-500 hover:bg-gray-100 rounded-md"
                  onClick={clickLogout}
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
});
export default Navbar;
