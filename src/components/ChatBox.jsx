import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, getAllPrompts, getAllResponses, addMessageUser, getInputsAndOutputs } from '../store/slices/AISlice';
import './ChatBox.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AISchema } from '../store/schemas/AISchema';
import { Send, Loader2, AlertCircle } from 'lucide-react';

const ChatBox = () => {
  const dispatch = useDispatch();
  const { userMessages, AIResponses, loading, error, allMessages } = useSelector((state) => state.ai);
  const { token } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
        dispatch(getInputsAndOutputs());
      dispatch(getAllPrompts());
      dispatch(getAllResponses());
    }
  }, [token, dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(AISchema),
    defaultValues: {
      text: "",
    },
    mode: 'onChange'
  });

  // Combine and sort messages by timestamp
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userMessages, AIResponses, loading]);

  const onSubmit = async (data) => {
    const messageText = data.text?.trim();
    
    if (!messageText) {
      return;
    }
    
    try {
      // Clear input immediately
      setValue('text', '', { shouldValidate: false });
      
      dispatch(addMessageUser(messageText));
      await dispatch(sendMessage({ text: messageText })).unwrap();
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally restore the message if send fails
      setValue('text', messageText);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)(); 
    }
  };
  // Combine messages - handle both string and object formats
  const everyMessage = [
    ...userMessages.map((msg, idx) => ({ 
      text: typeof msg === 'string' ? msg : (msg.text || msg.content || msg.prompt || JSON.stringify(msg)),
      sender: 'user',
      id: `user-${idx}`,
      timestamp: msg.timestamp || msg.createdAt || new Date().toISOString()
    })),
    ...AIResponses.map((msg, idx) => ({ 
      text: typeof msg === 'string' ? msg : (msg.text || msg.content || msg.response || msg.data || JSON.stringify(msg)),
      sender: 'ai',
      id: `ai-${idx}`,
      timestamp: msg.timestamp || msg.createdAt || new Date().toISOString()
    }))
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>Sura</h2>
        <span className="status-badge">{token ? 'Connected' : 'Disconnected'}</span>
      </div>

      <div className="chatbox-messages">
        {everyMessage.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Send a message to get started with your AI assistant</p>
          </div>
        ) : (
          <>
            {allMessages.map((msg, index) => (
                <div>
                    <div className="message user" key={`user-${index}`}>
                        <div className="message-content">
                            <p>{msg.input}</p>
                        </div>
                    </div>
                    <div className="message ai" key={`ai-${index}`}>
                        <div className="message-content">
                            <p>{msg.output}</p>
                        </div>
                    </div>
                </div>
            ))}
            {loading && (
              <div className="message ai">
                <div className="message-content loading-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="loading-text">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="chatbox-input-form">
        <div className="input-wrapper">
          <textarea
            placeholder="Type your message here..."
            {...register('text')}
            className={`chatbox-input ${errors.text ? 'error' : ''}`}
            rows="1"
            disabled={loading || !token}
            onKeyDown={handleKeyDown}
          />
          {errors.text && (
            <span className="input-error">{errors.text.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="send-btn"
          disabled={loading || !token}
        >
          {loading ? <Loader2 className="spinning" size={20} /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
