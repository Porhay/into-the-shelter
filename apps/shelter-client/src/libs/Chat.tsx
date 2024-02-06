import '../styles/Chat.scss'
import React, { useState } from 'react';
import userAvatar from '../assets/images/profile-image-default.jpg';


interface Message {
  text: string;
  icon: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, icon: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <img src={userAvatar} className="message-icon" alt="user avatar" />
            <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;