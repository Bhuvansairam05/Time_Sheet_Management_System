import './App.css'
import {Routes, BrowserRouter, Route} from "react-router-dom"
import Home from './components/Home.jsx'
import LoginModal from './components/LoginModal.jsx'
import Admin from './components/Admin.jsx'
import EmployeeDashboard from './components/EmployeeDasbhoard.jsx'
import Manager from './components/Manager.jsx'
import { Toaster } from "react-hot-toast";
function App() {
  return(
    <>
    <Toaster position="top-center" reverseOrder={true} />
      <BrowserRouter>
        <Routes>
          <Route path='/' index element={<Home/>}/>
          <Route path='/loginModal' element={<LoginModal/>}/>
          <Route path='/admin/dashboard' element={<Admin/>}/>
          <Route path='/manager/dashboard' element={<Manager/>}/>
          <Route path='/employee/dashboard' element={<EmployeeDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
