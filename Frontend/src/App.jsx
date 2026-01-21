import './App.css'
import {Routes, BrowserRouter, Route} from "react-router-dom"
import Home from './components/Home.jsx'
import LoginModal from './components/LoginModal.jsx'
import Admin from './components/Admin.jsx'
import Employee from './components/Employee.jsx'
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
          <Route path='/employee/dashboard' element={<Employee/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
