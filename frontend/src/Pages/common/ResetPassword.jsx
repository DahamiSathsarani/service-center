import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { reset_password } from "../../Api/UserAPI";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // Extract the token from the URL
  const [credentials, setCredentials] = useState({
    token: "",
    password: "",
    password_confirmation: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid token.");
    }
    setCredentials((prevData) => ({
      ...prevData,
      token: token,
    }));
  }, []);

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setCredentials((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await reset_password(credentials);
      if (response.status === 200) {
        toast.success("Password Updated Successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to reset password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] w-full bg-background">
      <div className="bg-[#ffff] rounded-lg shadow-lg w-[18rem] sm:w-[25rem] md:w-[30rem] lg:w-[35rem] px-[2rem] sm:px-[4rem] pt-[2rem] pb-[3rem] ">
        <h1 className="text-heading text-center mb-[2rem]">Forgot Password</h1>
        <form>
          <div>
            <div className="mb-6">
            <input
              className="bg-[#F9F9F9] w-full h-[2.5rem] sm:h-[3.5rem] pl-[1rem] rounded-md  text-mobile_body_label sm:text-tab_body_label lg:text-body_label "
              placeholder="Email"
              id="email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
            />
            </div>
            
            <div className="mb-6">
              <span className="relative ">
                <input
                  className="bg-[#F9F9F9] w-full h-[2.5rem] sm:h-[3.5rem] pl-[1rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label rounded-md "
                  placeholder="Password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </span>
            </div>
            <div>
              <span className="relative">
                <input
                  className="bg-[#F9F9F9] w-full h-[2.5rem] sm:h-[3.5rem] pl-[1rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label rounded-md mb-3"
                  placeholder="Confirm Password"
                  id="Confirm password"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={credentials.password_confirmation}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </span>
            </div>
            <button
              type="submit"
              className="w-full mt-5 mobile_submit-btn sm:tab_submit-btn lg:submit-btn"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
    /*  <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div> */
  );
}
