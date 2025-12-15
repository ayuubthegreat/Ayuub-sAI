import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import { logout } from '../store/slices/authSlice';
import { LogOut } from 'lucide-react';
import './home.css';

const Home = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {

        }
    }, [token, navigate]);

    

    return (
        <div className="home-container">
            

            <main className="home-main">
                <div className="home-content">
                    <div className="home-header">
                        <h2>AI Chat Assistant</h2>
                        <p>Ask me anything and I'll help you with intelligent responses</p>
                    </div>
                    <ChatBox />
                </div>
            </main>
        </div>
    );
}

export default Home;