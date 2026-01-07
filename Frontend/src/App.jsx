import './App.css'
import {Routes, BrowserRouter, Route} from "react-router-dom"
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import LoginModal from './components/LoginModal.jsx'
function App() {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' index element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/loginModal' element={<LoginModal/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
