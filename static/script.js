const { useState, useRef, useEffect } = React;

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const content = inputValue.trim();
        if (!content || isLoading) return;

        const newUserMsg = {
            id: Date.now().toString(),
            content,
            type: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, model: 'llama' })
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                content: data.response,
                type: 'ai',
                model: 'llama',
                duration: data.duration,
                timestamp: new Date()
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                content: `Error: ${error.message}`,
                type: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const clearChat = () => setMessages([]);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="app-container">
            <div className="header">
                <div className="header-content">
                    <h1 className="header-title">AI Assistant</h1>
                    {messages.length > 0 && (
                        <button onClick={clearChat} className="clear-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m3 6 18 0"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                            Clear Chat
                        </button>
                    )}
                </div>
            </div>

            <div className="chat-container">
                <div className="messages-area">
                    <div className="messages-content">
                        {messages.length === 0 ? (
                            <div className="welcome-screen">
                                <div className="welcome-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                                    </svg>
                                </div>
                                <h2 className="welcome-title">Welcome to AI Assistant</h2>
                                <p className="welcome-text">I'm powered by local Llama 3.2. How can I help?</p>
                            </div>
                        ) : (
                            <div className="messages-container">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`message ${msg.type}`}>
                                        <div className="message-wrapper">
                                            <div className="message-header">
                                                <div className="message-avatar">
                                                    {msg.type === 'user' ? (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                    ) : (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                                                    )}
                                                </div>
                                                <div className="message-info">
                                                    <span className="message-sender">{msg.type === 'user' ? 'You' : 'AI Assistant'}</span>
                                                    {msg.model && <span className="message-model">Llama 3.2</span>}
                                                </div>
                                            </div>
                                            <div className="message-bubble">
                                                <div className="message-text">{msg.content}</div>
                                            </div>
                                            <div className="message-footer">
                                                <span>{formatTime(msg.timestamp)}</span>
                                                {msg.duration && <span>{msg.duration.toFixed(2)}s</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="loading-indicator" style={{ display: 'block' }}>
                                <div className="loading-bubble">
                                    <div className="loading-content">
                                        <div className="loading-dots">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                        <span className="loading-text">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="input-area">
                    <div className="input-content">
                        <form onSubmit={handleSubmit} className="chat-form">
                            <div className="model-section">
                                <span className="model-label">Model:</span>
                                <div className="select-wrapper">
                                    <select className="model-select" disabled>
                                        <option value="llama">Llama 3.2</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-section">
                                <div className="textarea-container">
                                    <textarea 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="message-textarea"
                                        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                                        rows={1}
                                        style={{ height: inputValue ? 'auto' : '1em' }}
                                    />
                                </div>
                                <button type="submit" disabled={!inputValue.trim() || isLoading} className="send-button">
                                    {!isLoading ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                                        </svg>
                                    ) : (
                                        <div className="loading-spinner" style={{ display: 'block' }}>
                                            <div className="spinner"></div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);
root.render(<ChatApp />);