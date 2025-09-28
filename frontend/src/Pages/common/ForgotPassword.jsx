import React, { useState } from "react";
import { forgot_password } from "../../Api/UserAPI";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await forgot_password({ email: email });
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to send password reset link.");
    }
  };
  const handleChange = (e) => {
    console.log(e.target.value);
    setEmail(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-[100vh] w-full bg-background">
      <div className="bg-[#ffff] rounded-lg shadow-lg w-[18rem] sm:w-auto px-[2rem] sm:px-[4rem] pt-[2rem] pb-[3rem] ">
        <h1 className="text-heading text-center mb-[2rem]">Forgot Password</h1>
        <form>
          <div>
            <input
              className="bg-[#F9F9F9] w-full h-[2.5rem] sm:h-[3.5rem] pl-[1rem] rounded-md mb-6 text-mobile_body_label sm:text-tab_body_label lg:text-body_label"
              placeholder="Email"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full mt-5 mobile_submit-btn sm:tab_submit-btn lg:submit-btn"
              onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
