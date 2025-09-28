import React, { useState } from "react";
import { customer_search } from "../../Api/CustomerAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerSearchPage() {
  const location = useLocation();
  const type = location.state?.type;
  const vehicle_number = location.state?.vehicle_number;
  const navigate = useNavigate();
  const [phone_number, setPhoneNumber] = useState("");

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const onClickEnterBtn = async(e) => {
    e.preventDefault()
    try{
        const response = await customer_search({'phone_number':phone_number});
          console.log("hi",response.data);
          if (response.status === 200) {
            if (type === 'view') {
              navigate(`/advisor/customer/${response.data.id}/view`)
            } else if (type === 'update') {
              navigate(`/advisor/customer/${vehicle_number}/update/${response.data.id}`)
            }
             
    }}catch(error){
       console.log("Error:", error);
          if (error.response?.status === 404) {
              toast.error(error.response?.data?.message || "Customer not found!");
              console.log("type",type)
              if (type === 'view') {
                navigate(`/advisor/customer/create`)
              } else if (type === 'update') {
                navigate(`/advisor/customer/${vehicle_number}/create`)
              }
          } else {
              toast.error("An error occurred. Please try again.");
          }
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] w-full bg-background">
      <div className="bg-[#ffff] rounded-lg shadow-lg w-[18rem] sm:w-[30rem] md:w-[40rem] lg:w-[50rem] px-[2rem] sm:px-[4rem] pt-[2rem] pb-[3rem] ">
        <h1 className="text-heading text-center mb-[2rem]">Search Customer</h1>
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
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
