import { React, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { user_login } from "../../Api/UserAPI";
import {
  getCredentials,
  removeCredentials,
  setAuthToken,
  setCredentials,
} from "../../Helpers/LocalStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberToken, setRememberToken] = useState(false);
  useEffect(() => {
    const { email, password } = getCredentials();
    if (email && password) {
      setRememberToken(true);
      setFormData({
        email: email,
        password: password,
      });
    }
  }, []);
  const onChangeRemember = (e) => {
    setRememberToken(e.target.checked);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await user_login(formData);
      if (response.status === 200) {
        if (rememberToken) {
          setCredentials(formData.email, formData.password);
        } else {
          removeCredentials();
        }
        setAuthToken(response.data.token);
        if (response.data.user_type === 1) {
          navigate("/admin/dashboard");
        } else if (response.data.user_type === 2) {
          navigate("/advisor/dashboard");
        }
      } 
    } catch (error) {
      console.log("error", error);
      if (error.response.status === 404) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.response.status === 400) {
        console.log("status is not correct");
        toast.error("User Account Inactivated");
      }
    }
  };
  return (
    <div className="flex justify-center items-center h-[100vh] w-full bg-background">
      <div className="bg-[#ffff] rounded-lg shadow-lg w-[18rem] sm:w-auto px-[2rem] sm:px-[4rem] pt-[2rem] pb-[3rem] ">
        <h1 className="text-heading text-center mb-[2rem]">Login</h1>
        <form onSubmit={onSubmit}>
          <div>
            <input
              className="bg-[#F9F9F9] w-full h-[2.5rem] sm:h-[3.5rem] pl-[1rem] rounded-md mb-6 text-mobile_body_label sm:text-tab_body_label lg:text-body_label"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
            <span className="relative ">
              <input
                className="bg-[#F9F9F9] w-full h-[2.5rem] sm:h-[3.5rem] pl-[1rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label rounded-md mb-3"
                placeholder="Password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </span>
            <div className="flex w-full justify-between h-[2rem] items-center">
              <span className="h-[2rem] flex items-center">
                <input
                  type="checkbox"
                  name="remember_icon"
                  id="remember_icon"
                  checked={rememberToken}
                  onChange={onChangeRemember}
                />
                <span className="text-mobile_body sm:text-tab_body lg:text-body ml-2">
                  Remember me
                </span>
              </span>
              <Link
                to="/forgot-password"
                className="text-mobile_body_label sm:text-tab_body_label lg:text-body_label  text-primary"
              >
                Forget Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full mt-5 mobile_submit-btn sm:tab_submit-btn lg:submit-btn"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
