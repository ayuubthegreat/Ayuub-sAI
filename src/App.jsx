import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Navbar from `src/components/navbar.jsx`
import './App.css'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { checkForUserInfo } from './store/slices/authSlice.js'
import { useDispatch } from 'react-redux'

function App() {
  const {user, token} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token && !user) {
      console.log('User data is missing despite having a token. Consider fetching user details.');
      dispatch(checkForUserInfo()).unwrap();
    }
  })
  return (
    
    <BrowserRouter> 
    <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
