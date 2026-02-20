import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import Loader from './Loader';
import { GoogleLogin } from "@react-oauth/google";

function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      try {
        setLoading(true);
        const response = await fetch("https://repressedly-hyperopic-rosario.ngrok-free.dev/api/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ email, password ,rememberMe})
        });
        const result = await response.json();
        if (response.ok) {
          const role = result.user.role;

          toast.success("Login successful 🎉", {
            style: {
              border: "1px solid #1D4ED8",
              padding: "12px",
              color: "#1E40AF",
            },
            iconTheme: {
              primary: "#1D4ED8",
              secondary: "#fff",
            }
          });
          localStorage.setItem("token", result.token);
          localStorage.setItem("role", role);
          if (role === "admin") {
            navigate("/admin/dashboard", {
              state: {
                user: result.user
              }
            });
          } else if (role=="manager") {
            navigate("/manager/dashboard", {
              state: { user: result.user }
            });
          } else {
            navigate("/employee/dashboard", {
              state: { user: result.user }
            });
          }
        }
        else {
          toast.error(result.message);
        }
      }
      catch (Exception) {
        toast.error("500 server not found");
      }
      finally {
        setLoading(false);
      }

    }

  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleGoogleSignin = () => {
  };
  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      const res = await fetch("https://repressedly-hyperopic-rosario.ngrok-free.dev/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: response.credential,
          rememberMe
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful 🎉");

        const role = data.user.role;

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        // ✅ SEND USER SAME AS PASSWORD LOGIN
        if (role === "admin") {
          navigate("/admin/dashboard", {
            state: { user: data.user }
          });
        } else if (role==="manager") {
          navigate("/manager/dashboard", {
            state: { user: data.user }
          });
        } else {
          navigate("/employee/dashboard", {
            state: { user: data.user }
          });
        }

      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };



  if (!isOpen) return null;
  return (
    <>
      {loading && <Loader />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh]  flex">
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 items-center justify-center p-8">
            <div className="text-center text-white">
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-3">Gradious TimeSheet</h1>
                <p className="text-lg text-blue-100
">Streamline Your Time Management</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      ⏰
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Track Time Efficiently</h3>
                      <p className="text-blue-100 text-sm">Monitor your work hours seamlessly</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      📊
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Manage Projects</h3>
                      <p className="text-blue-100 text-sm">Keep all your projects organized</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      ✅
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-base">Boost Productivity</h3>
                      <p className="text-blue-100 text-sm">Achieve more in less time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative overflow-y-hidden p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="max-w-md mx-auto">
              <div className="lg:hidden text-center mb-6">
                <h1 className="text-2xl font-bold text-blue-700 mb-1">Gradious TimeSheet</h1>
                <p className="text-gray-600 text-sm">Welcome back!</p>
              </div>
              <div className='overflow-y-hidden'>
                <div className="mb-2">
                  <h2 className="text-2xl text-center font-bold text-gray-800 mb-1">Login</h2>
                  <p className="text-gray-600 text-center text-sm">Enter your credentials to access your account</p>
                  {errors.message && (
                    <div className="mt-4 mx-auto inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
                      <span>⚠️</span>
                      <span>{errors.message}</span>
                    </div>
                  )}

                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
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
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#2F6FD6]'
                        }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.email}
                      </p>
                    )}
                  </div>
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
                        className={`w-full px-4 py-2.5 pr-12 border-2 rounded-lg focus:outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-[#2F6FD6]'
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
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-700"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button onClick={() => console.log('Forgot password')} className="text-sm text-[#2F6FD6] hover:text-[#1F4FBF] font-semibold">
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition duration-200 shadow-lg hover:shadow-xl"

                  >
                    Login
                  </button>
                </div>
                <div className="mt-4 mb-4 flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-xs text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleResponse}
                    onError={() => {
                      toast.error("Google Login Failed");
                    }}
                  />
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginModal;