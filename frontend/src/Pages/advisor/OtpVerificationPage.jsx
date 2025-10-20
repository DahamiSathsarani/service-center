import React, { useState, useEffect, useRef } from "react";
import { sendOtp, updateMobileNumber, verifyOtp } from "../../Api/CustomerAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OtpVerificationPage() {
  const location = useLocation();
  const type = location.state?.type;
  const mobile_number = location.state?.mobile_number;
  const vehicle_number = location.state?.vehicle_number;
  const user_role = location.state?.user_role;
  const customer_id = location.state?.customer_id;
  const navigate = useNavigate();

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(120); // OTP expire time
  const inputRefs = useRef([]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { 
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      toast.error("Please enter complete OTP!");
      return;
    }

    try {
      const response = await verifyOtp(mobile_number, otpString);

      if(response.status == 200) {
        toast.success("OTP verified successfully!");

        if (type === "update") {
          navigate(`/advisor/customer/${response.data.id}/update`);
        } else {
          if(user_role == 1) {
            if (customer_id) {
              try {
                console.log("customer id", customer_id)
                const response = await updateMobileNumber(customer_id, mobile_number);
                toast.success(response.data.message);
                navigate(`/admin/customer/${customer_id}/update`);
              } catch(error) {
                if (error.response?.status === 422 && error.response.data.errors) {
                  const firstErrorKey = Object.keys(error.response.data.errors)[0];
                  const firstErrorMsg = error.response.data.errors[firstErrorKey][0];
                  toast.error(firstErrorMsg);
                } else {
                  toast.error(error.response?.data?.message || "Something went wrong!");
                }
              }
            } else {
              navigate(`/admin/customer/create`, { state: { mobile_number: mobile_number } });
            }
          } else {
            if(vehicle_number) {
              navigate(`/advisor/customer/${vehicle_number}/create`, { state: { mobile_number: mobile_number } })
            } else {
              navigate(`/advisor/customer/create`, { state: { mobile_number: mobile_number } });
            }
          }
        }
      }
      
    } catch (error) {
      const message =
        error.response?.data?.message || "OTP verification failed!";
      toast.error(message);
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendOtp({ mobile_number });
      toast.success(`OTP sent to ${mobile_number}`);
      setOtp(new Array(OTP_LENGTH).fill(""));
      setResendTimer(120); // reset timer
      inputRefs.current[0].focus();
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] w-full bg-background">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-8">
        <h1 className="text-heading text-center mb-6">
          OTP Verification
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Enter the 6-digit OTP sent to <b>{mobile_number}</b>
        </p>

        <form
          className="flex justify-center space-x-2 mb-6"
          onSubmit={handleVerify}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </form>

        <button
          onClick={handleVerify}
          className="w-full py-2 rounded-lg mobile_submit-btn sm:tab_submit-btn lg:submit-btn mb-4"
        >
          Verify OTP
        </button>

        <div className="text-center">
          <button
            onClick={handleResendOtp}
            disabled={resendTimer > 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              resendTimer > 0
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-green-500"
            }`}
          >
            {resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </div>

        <p className="text-center text-gray-500 mt-3">
          OTP will expire in {resendTimer}s
        </p>
      </div>
    </div>
  );
}
