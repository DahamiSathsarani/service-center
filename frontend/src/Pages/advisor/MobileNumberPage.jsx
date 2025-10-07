import React, { useState } from "react";
import { sendOtp } from "../../Api/CustomerAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MobileNumberPage({userRole}) {
  const location = useLocation();
  // const type = location.state?.type;
  const vehicle_number = location.state?.vehicle_number;
  const customer_id = location.state?.customer_id;
  const navigate = useNavigate();
  const [phone_number, setPhoneNumber] = useState("");

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const onClickEnterBtn = async(e) => {
    e.preventDefault()
    try{
        const response = await sendOtp({'mobile_number':phone_number});
            console.log("hi",response);
            if (response.status === 200) {
              toast.success("OTP sent successfully");
              if(userRole == 1) {
                navigate(`/admin/customer/otp-verification`, { state: { mobile_number: phone_number, user_role: userRole, customer_id: customer_id } });
              } else {
                navigate(`/advisor/customer/otp-verification`, { state: { mobile_number: phone_number, vehicle_number: vehicle_number} });
              }
             
    }}catch(error){
        console.log("Error:", error);
        toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] w-full bg-background">
      <div className="bg-[#ffff] rounded-lg shadow-lg w-[18rem] sm:w-[30rem] md:w-[40rem] lg:w-[50rem] px-[2rem] sm:px-[4rem] pt-[2rem] pb-[3rem] ">
        <h1 className="text-heading text-center mb-[2rem]">Enter Customer Mobile Number</h1>
        <form className="md:flex justify-center " onSubmit={onClickEnterBtn}>
          <div className="w-full md:flex md:h-[3rem] md:w-[28rem] lg:w-[38rem] items-center justify-between">
            <input
              className="bg-[#F9F9F9] w-full  h-[2.5rem] sm:h-[3.5rem] pl-[1rem] rounded-md mb-6 md:mb-0 md:mr-6 text-mobile_body_label sm:text-tab_body_label lg:text-body_label"
              placeholder="Mobile Number"
              id="mobile_number"
              name="mobile_number"
              value={phone_number}
              onChange={handleChange}
              type="tel"
            />
            <button
              type="submit"
              className="w-full  md:mt-0 md:w-[8rem] mobile_submit-btn sm:tab_submit-btn lg:submit-btn"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
