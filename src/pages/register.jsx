import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerSchema } from '../store/schemas/AISchema';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { WEBSITE_NAME } from '../store/BASE_URL';
import './login.css';


const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })
    const onSubmit = async (data) => {
        try {
            await dispatch(register(data)).unwrap();
            navigate('/');
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to {WEBSITE_NAME}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" {...register('username')} className={errors.username ? 'error' : ''} placeholder="Enter your username" disabled={loading} />
            {errors.username && (
              <span className="error-message">{errors.username.message}</span>
            )}
            </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Registering...' : `${token ? 'Registered!' : 'Register'}` }
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;