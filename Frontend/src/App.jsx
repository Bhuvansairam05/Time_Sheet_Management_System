import './App.css'
import {Routes, BrowserRouter, Route} from "react-router-dom"
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import LoginModal from './components/LoginModal.jsx'
import Admin from './components/Admin.jsx'
import Employee from './components/Employee.jsx'
import Manager from './components/Manager.jsx'
function App() {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' index element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/loginModal' element={<LoginModal/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/manager' element={<Manager/>}/>
          <Route path='/employee' element={<Employee/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
