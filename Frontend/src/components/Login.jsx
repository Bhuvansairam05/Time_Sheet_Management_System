import { useState } from "react";
function Login(){
   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: ''
    };

    // Validate username
    if (!username.trim()) {
      newErrors.username = 'Username field is required';
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = 'Password field is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (validateForm()) {
      // If validation passes, proceed with login
      console.log('Login attempt with:');
      console.log('Username:', username);
      console.log('Password:', password);  
      alert('Login successful! Username: ' + username);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen max-h-screen flex overflow-hidden">
      {/* Back to Home Button - Top Left */}
      <button 
        onClick={() => window.location.href = '/'} 
        className="absolute top-4 left-4 z-50 flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
      
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-orange-500 items-center justify-center p-8">
        <div className="text-center text-white max-w-lg">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">TimeTrack Pro</h1>
            <p className="text-lg text-orange-100">Streamline Your Time Management</p>
          </div>
          
          {/* Decorative Illustration */}
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-orange-600 mb-1">TimeTrack Pro</h1>
            <p className="text-gray-600 text-sm">Welcome back!</p>
          </div>

          {/* Login Form */}
          <div className="bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Login</h2>
              <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
            </div>

            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({...errors, username: ''});
                  }}
                  placeholder="Enter your username"
                  className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${
                    errors.username ? 'border-red-500' : 'border-gray-300 focus:border-orange-600'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.username}
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
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-2.5 pr-12 border-2 rounded-lg focus:outline-none transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300 focus:border-orange-600'
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
                <button onClick={() => console.log('Forgot password clicked')} className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
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

            {/* Additional Options */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button onClick={() => console.log('Contact admin')} className="text-orange-600 hover:text-orange-700 font-semibold">
                  Contact Admin
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;