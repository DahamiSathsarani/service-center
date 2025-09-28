import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_user_profile_details } from "../../Api/UserAPI";
import UserCreateAndView from "../../Components/Forms/UserCreateAndView";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";

export default function UserProfile() {
  const { user_id } = useParams();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    get_user_details(user_id || 0);
  }, [user_id]);

  const get_user_details = async (user_id) => {
    try {
      console.log("user id", user_id);
      const response = await get_user_profile_details(user_id);
      console.log("response", response.data);

      if (response.status === 200) {
        setUserDetails(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.response);
    }
  };

  return (
    <NormalBackground
      title="User Details"
      componentName={UserCreateAndView}
      type="view"
      data={userDetails}
    />
  );
}
