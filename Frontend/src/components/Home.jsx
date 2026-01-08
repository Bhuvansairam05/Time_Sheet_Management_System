import { useState } from 'react';
import LoginModal from './LoginModal';
import logo from '../assets/Logo_remove.png';
function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 overflow-hidden">
        {/* <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 whitespace-nowrap">TimeTrack Pro</div>
          <ul className="flex gap-2 sm:gap-4 md:gap-8 items-center text-xs sm:text-sm md:text-base">
            <li className="hidden sm:block"><a href="#features" className="text-gray-700 hover:text-orange-600 transition whitespace-nowrap">Features</a></li>
            <li className="hidden md:block"><a href="#about" className="text-gray-700 hover:text-orange-600 transition whitespace-nowrap">About</a></li>
            <li className="hidden md:block"><a href="#contact" className="text-gray-700 hover:text-orange-600 transition whitespace-nowrap">Contact</a></li>
            <li><button onClick={openLoginModal} className="bg-orange-600 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg hover:bg-orange-700 transition whitespace-nowrap">Login</button></li>
          </ul>
        </nav> */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
  
  {/* Logo + Brand */}
  <div className="flex items-center gap-2 whitespace-nowrap">
    <img
      src={logo}
      alt="TimeTrack Pro Logo"
      className="h-6 sm:h-7 md:h-8 w-auto object-contain"
    />
    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
      TimeTrack Pro
    </span>
  </div>

  {/* Nav Links */}
  <ul className="flex gap-2 sm:gap-4 md:gap-8 items-center text-xs sm:text-sm md:text-base">
    <li className="hidden sm:block">
      <a href="#features" className="text-gray-700 hover:text-orange-600 transition whitespace-nowrap">
        Features
      </a>
    </li>
    <li className="hidden md:block">
      <a href="#about" className="text-gray-700 hover:text-orange-600 transition whitespace-nowrap">
        About
      </a>
    </li>
    <li className="hidden md:block">
      <a href="#contact" className="text-gray-700 hover:text-orange-600 transition whitespace-nowrap">
        Contact
      </a>
    </li>
    <li>
      <button
        onClick={openLoginModal}
        className="bg-orange-600 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg hover:bg-orange-700 transition whitespace-nowrap"
      >
        Login
      </button>
    </li>
  </ul>
</nav>

      </header>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 bg-gradient-to-br from-orange-600 to-orange-500 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">Streamline Your Time Management</h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-orange-50">Efficient time sheet management for teams. Track tasks, manage projects, and boost productivity with ease.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={openLoginModal} className="bg-white text-orange-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition text-center">Get Started</button>
              <a href="#features" className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition text-center">Learn More</a>
            </div>
          </div>
          <div className="block">
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 text-gray-800">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-orange-600">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-semibold text-sm sm:text-base">Projects Managed</span>
                  <span className="text-orange-600 font-bold text-lg sm:text-xl">500+</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-semibold text-sm sm:text-base">Active Users</span>
                  <span className="text-orange-600 font-bold text-lg sm:text-xl">2,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">Time Saved</span>
                  <span className="text-orange-600 font-bold text-lg sm:text-xl">40%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800">Powerful Features</h2>
          <p className="text-center text-gray-600 mb-10 sm:mb-16 text-base sm:text-lg">Everything you need to manage time sheets effectively</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Employee Features */}
            <div className="bg-orange-50 p-6 sm:p-8 rounded-lg border-2 border-orange-200 hover:border-orange-600 transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-white">👤</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Employee Access</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Check-in and check-out functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Submit tasks with time tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Select and manage projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Track time spent on tasks</span>
                </li>
              </ul>
            </div>

            {/* Manager Features */}
            <div className="bg-orange-50 p-6 sm:p-8 rounded-lg border-2 border-orange-200 hover:border-orange-600 transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Manager Access</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>View assigned employees</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Review submitted time sheets</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Approve or reject submissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Monitor team productivity</span>
                </li>
              </ul>
            </div>

            {/* Admin Features */}
            <div className="bg-orange-50 p-6 sm:p-8 rounded-lg border-2 border-orange-200 hover:border-orange-600 transition sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-white">⚙️</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Admin Control</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Add and manage projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Onboard new employees</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Configure platform settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Generate comprehensive reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">How It Works</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-orange-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4">1</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Login</h3>
              <p className="text-sm sm:text-base text-orange-50">Access your personalized dashboard</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-orange-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4">2</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Check-In</h3>
              <p className="text-sm sm:text-base text-orange-50">Start your work day with one click</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-orange-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4">3</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Add Tasks</h3>
              <p className="text-sm sm:text-base text-orange-50">Log tasks and time spent</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-orange-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4">4</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Submit</h3>
              <p className="text-sm sm:text-base text-orange-50">Send to manager for approval</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">Ready to Transform Your Time Management?</h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">Join hundreds of teams already using TimeTrack Pro to boost productivity</p>
          <button onClick={openLoginModal} className="inline-block bg-orange-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-orange-700 transition">Get Started Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-3 sm:mb-4">TimeTrack Pro</div>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Efficient time sheet management for modern teams</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 sm:mb-6 text-sm sm:text-base">
            <a href="#" className="text-gray-400 hover:text-orange-600 transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-orange-600 transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-orange-600 transition">Support</a>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">For more details visit gradious.com</p>
          <p className="text-gray-500 text-xs sm:text-sm">© 2026 TimeTrack Pro. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal - Import this separately */}
      {/* <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} /> */}
      {/* Placeholder for modal - You'll import the LoginModal component */}
    </div>
    <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}
export default Home;