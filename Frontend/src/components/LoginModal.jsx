import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    message: ''
  });
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      message: ''
    };
    if (!email.trim()) {
      newErrors.email = 'email field is required';
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = 'Password field is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login attempt with:');
      console.log('email:', email);
      console.log('Password:', password);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok) {
        const role = result.user.role;
        const is_manager = result.user.is_manager;

        toast.success("Login successful 🎉", {
          style: {
            border: "1px solid #f97316",
            padding: "12px",
            color: "#9a3412",
          },
          iconTheme: {
            primary: "#f97316",
            secondary: "#fff",
          },
        });


        localStorage.setItem("token", result.token);
        localStorage.setItem("role", role);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (is_manager) {
          navigate("/manager/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      }
      else {
        toast.error("Invalid credentials ");
      }

      // Add your authentication logic here
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleGoogleSignin = () => {
    console.log('Google signin clicked');
    // Add Google OAuth logic here
    alert('Google signin will be implemented here');
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
        {/* Left Side - Image Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-orange-500 items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-3">TimeTrack Pro</h1>
              <p className="text-lg text-orange-100">Streamline Your Time Management</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    ⏰
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-base">Track Time Efficiently</h3>
                    <p className="text-orange-100 text-sm">Monitor your work hours seamlessly</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    📊
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-base">Manage Projects</h3>
                    <p className="text-orange-100 text-sm">Keep all your projects organized</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    ✅
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-base">Boost Productivity</h3>
                    <p className="text-orange-100 text-sm">Achieve more in less time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 relative overflow-y-hidden p-8">
          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-md mx-auto">
            {/* Logo for Mobile */}
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-2xl font-bold text-orange-600 mb-1">TimeTrack Pro</h1>
              <p className="text-gray-600 text-sm">Welcome back!</p>
            </div>

            {/* Login Form */}
            <div className='overflow-y-hidden'>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Login</h2>
                <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
                {errors.message && (
                  <div className="mt-4 mx-auto inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
                    <span>⚠️</span>
                    <span>{errors.message}</span>
                  </div>
                )}

              </div>

              <div className="space-y-4">
                {/* email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-text text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '', message: '' });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    placeholder="Enter your email"
                    className={`w-64 px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-orange-600'
                      }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      placeholder="Enter your password"
                      className={`w-64 px-4 py-2.5 pr-12 border-2 rounded-lg focus:outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-orange-600'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button onClick={() => console.log('Forgot password')} className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Login
                </button>
              </div>

              {/* Divider */}
              <div className="mt-6 mb-4 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-xs text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google Signin */}
              <button
                onClick={handleGoogleSignin}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign In with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginModal;