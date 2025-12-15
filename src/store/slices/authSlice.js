import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL.js';



export const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
}


export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                // Server responded with error
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                // Request made but no response
                return rejectWithValue({ 
                    message: 'Cannot connect to server. Please check if the API is running.' 
                });
            } else {
                // Something else happened
                return rejectWithValue({ 
                    message: error.message || 'An unexpected error occurred' 
                });
            }
        }
    }
)
export const register = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, { username, email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                // Server responded with error
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                // Request made but no response
                return rejectWithValue({ 
                    message: 'Cannot connect to server. Please check if the API is running.' 
                });
            } else {
                // Something else happened
                return rejectWithValue({ 
                    message: error.message || 'An unexpected error occurred' 
                });
            }
        }
    }
);
export const checkForUserInfo = createAsyncThunk( // For use when user info is null but token exists
    'auth/checkForUserInfo',
    async (__, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
                },
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                // Server responded with error
                return rejectWithValue(error.response.data);
            }
            else if (error.request) {
                // Request made but no response
                return rejectWithValue({ 
                    message: 'Cannot connect to server. Please check if the API is running.' 
                });
            }
        }
    }

)


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data.user;
            state.token = action.payload.data.token;
            localStorage.setItem('token', action.payload.data.token);
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Login failed. Please try again.';
        });
        builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data.user;
            state.token = action.payload.data.token;
            localStorage.removeItem('token'); // Clear any existing token
            localStorage.setItem('token', action.payload.data.token);
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Registration failed. Please try again.';
        })
        .addCase(checkForUserInfo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(checkForUserInfo.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
            console.log('User info successfully fetched:', action.payload, state.user);
        })
        .addCase(checkForUserInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to fetch user info.';
            console.error('Failed to fetch user info:', action.payload);
        });
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;