import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // add user message to messages container
    const userMessage = { text: input, isUser: true };
    setMessages([...messages, userMessage]);
    setInput('');

    // add temporary bot message with 3 dots to messages container
    const temporaryBotMessage = { text: '...', isUser: false, isTemporary: true };
    setMessages([...messages, userMessage, temporaryBotMessage]);

    // send message to server
    const serverUrl = `${process.env.REACT_APP_SERVER_URL}/api/messages`;
    const response = await axios.post(serverUrl, { message: input, chatId: chatId });

    // remove temporary message from messages container and add actual bot message
    const botMessage = { text: response.data.message, isUser: false };
    setMessages((messages) =>
      messages.map((message) =>
        message.isTemporary ? { ...botMessage, isTemporary: false } : message
      )
    );

    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  useEffect(() => {
    // generate a UUID when the component mounts
    const uuid = uuidv4();
    setChatId(uuid); // store the generated UUID in state
  }, []);

  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);


  const handleChange = (e) => setInput(e.target.value);

  return (
    <div className="container">
      <h1>ChatGPT-B</h1>
      <div id="messages-container" className="messages">
        {messages.map((message, index) => (
          <div className={`message ${message.isUser ? 'user' : ''}`} key={index}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            className="input-field"
            placeholder="Type your message here..."
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;