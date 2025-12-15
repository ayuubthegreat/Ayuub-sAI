import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import './navbar.css';

// DEBUG - Remove this after checking

console.log('Navbar component loaded');

const Navbar = () => {
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // DEBUG - Remove this after checking
    console.log('Navbar - Token value:', token);
    console.log('Navbar - Token type:', typeof token);
    console.log('Navbar - Token truthy?', !!token);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    return (
        <nav className="home-navbar">
                <div className="nav-brand">
                    <h1>{user ? `${user.name}` : 'Guest'}'s AI</h1>
                </div>
                <div className="nav-actions">
                    {user && <span className="welcome-text">Welcome, {user.name || user.email}</span>}
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </nav>
    );
}
export default Navbar;