import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

export const initialState = {
    userMessages: [{}],
    AIResponses: [{}],
    allMessages: [{}],
    currentResponse: null,
    loading: false,
    error: null,
}

// Async thunk to send message to AI API
export const sendMessage = createAsyncThunk(
    'ai/sendMessage',
    async ({ text }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/generate`, 
                { text },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { 
                    success: false, 
                    message: 'Failed to connect to API' 
                }
            );
        }
    }
);
export const getAllPrompts = createAsyncThunk(
    'ai/getAllPrompts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/generate/prompts`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { 
                    success: false, 
                    message: 'Failed to connect to API' 
                }
            );
        }
    }
);
export const getAllResponses = createAsyncThunk(
    'ai/getAllResponses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/generate/responses`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { 
                    success: false, 
                    message: 'Failed to connect to API' 
                }
            );
        }
    }
);
export const getInputsAndOutputs = createAsyncThunk(
    'ai/getInputsAndOutputs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/generate/history`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
                }
            })
            return response.data;
        } catch (error) {

        }
    }
);


const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        addMessageUser: (state, action) => {
            state.userMessages.push(action.payload);
        },
        clearMessages: (state) => {
            state.userMessages = [];
            state.AIResponses = [];
            state.currentResponse = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.currentResponse = action.payload.data;
                
                // Add AI response to AIResponses array
                if (action.payload.success && action.payload.data) {
                    state.AIResponses.push({
                        text: action.payload.data.output
                    });
                    state.allMessages.push({
                        input: action.payload.data.input,
                        output: action.payload.data.output
                    })
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
            builder
            .addCase(getAllPrompts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPrompts.fulfilled, (state, action) => {
                state.loading = false;
                state.userMessages = [...action.payload.data];

            })
            .addCase(getAllPrompts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
            builder
            .addCase(getAllResponses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllResponses.fulfilled, (state, action) => {
                state.loading = false;
                state.AIResponses = [...action.payload.data];
            })
            .addCase(getAllResponses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
            builder
            .addCase(getInputsAndOutputs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInputsAndOutputs.fulfilled, (state, action) => {
                state.loading = false;
                state.allMessages = [...action.payload.data];
            })
            .addCase(getInputsAndOutputs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
    }
});

export const { clearMessages, clearError, addMessageUser } = aiSlice.actions;
export default aiSlice.reducer;
