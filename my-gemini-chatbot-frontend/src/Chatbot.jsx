// src/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        // UPDATED: Give the initial message a unique ID
        { id: 'initial-bot-message', text: "Hello! How can I assist you today?", sender: "bot" },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const chatDisplayRef = useRef(null);

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '' || isTyping) return;

        // UPDATED: Generate a unique ID for the user's new message
        const userMessageId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newMessage = { id: userMessageId, text: inputMessage, sender: "user" };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage('');

        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: newMessage.text,
                    history: messages // Pass the existing `messages` array for context
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const botResponseText = data.aiResponse || "I didn't get a clear response.";
            // UPDATED: Generate a unique ID for the bot's response message
            const botMessageId = `bot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const botResponse = { id: botMessageId, text: botResponseText, sender: "bot" };

            setMessages((prevMessages) => [...prevMessages, botResponse]);

        } catch (error) {
            console.error("Error sending message to backend:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                // UPDATED: Assign an ID to the error message too
                { id: `error-${Date.now()}`, text: `Oops! Could not connect to the AI. Error: ${error.message}`, sender: "bot" },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
                    onClick={toggleChatbot}
                    aria-label="Open Chatbot"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 1.011-.68 1.916-1.666 2.373a4.522 4.522 0 0 0-.253 1.037c-.366 1.444-1.368 2.768-2.551 3.972s-2.607 2.309-3.972 2.551a4.522 4.522 0 0 0-1.037.253C10.084 21.32 9.18 22 8.169 22c-.785 0-1.488-.352-1.968-.9L3 18.25l-.018-.003A3.75 3.75 0 0 1 3 15.688V8.169c0-1.011.68-1.916 1.666-2.373a4.522 4.522 0 0 0 .253-1.037C5.285 3.315 6.287 1.991 7.47 .787s2.607-2.309 3.972-2.551a4.522 4.522 0 0 0 1.037-.253C13.916.68 14.82 0 15.831 0c.785 0 1.488.352 1.968.9L21 4.75l.018.003A3.75 3.75 0 0 1 21 7.312v8.52ZM12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
                        />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="max-w-md bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden
                            transform transition-all duration-500 ease-in-out
                            origin-bottom-right
                            scale-100 opacity-100
                            ">
                    <div className="flex flex-col h-[400px]">
                        <div className="px-4 py-3 border-b dark:border-zinc-700 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                                Chatbot Assistant
                            </h2>
                            <button
                                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-200"
                                onClick={toggleChatbot}
                                aria-label="Close Chatbot"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div
                            ref={chatDisplayRef}
                            className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2"
                            id="chatDisplay"
                        >
                            {/* UPDATED: Removed 'index' from map arguments, and using msg.id for key */}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id} // NOW USING msg.id as the key!
                                    className={`flex ${
                                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                    } items-start gap-2`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 flex-shrink-0 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs mt-1">
                                            AI
                                        </div>
                                    )}

                                    <div
                                        className={`chat-message prose prose-invert ${
                                            msg.sender === 'user'
                                                ? 'self-end bg-blue-500'
                                                : 'self-start bg-zinc-500'
                                        } text-white max-w-xs rounded-lg px-3 py-1.5 text-sm`}
                                    >
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>

                                    {msg.sender === 'user' && (
                                        <div className="w-8 h-8 flex-shrink-0 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs mt-1">
                                            You
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="self-start bg-zinc-600 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm animate-pulse">
                                    ...
                                </div>
                            )}
                        </div>

                        <div className="px-3 py-2 border-t dark:border-zinc-700">
                            <div className="flex gap-2">
                                <input
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
                                    id="chatInput"
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isTyping}
                                />
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
                                    id="sendButton"
                                    onClick={handleSendMessage}
                                    disabled={isTyping}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;