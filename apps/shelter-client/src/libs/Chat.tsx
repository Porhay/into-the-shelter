import '../styles/Chat.scss'
import React, { useEffect, useState } from 'react';
import userAvatar from '../assets/images/profile-image-default.jpg';
import io from 'socket.io-client';
import * as config from '../config'

interface IState {
  messages: Message[];
  newMessage: string;
}

interface Message {
  sender: string;
  message: string;
  icon: string;
}

const socket = io(config.gatewayUrl);

const Chat: React.FC = () => {
  const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    messages: [],
    newMessage: ''
  });

  useEffect(() => {
    socket.on('message', (data: Message) => {
      updateState({ messages: [...state.messages, data] });

    });
  }, [state.messages]);

  const handleSendMessage = () => {
    if (state.newMessage.trim() !== '') {
      socket.emit('message', { sender: 'denys', message: state.newMessage, icon: 'user' });
      updateState({ newMessage: '' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="messages-container">
        {state.messages.map((message, index) => (
          <div className="message" key={index}>
            <img src={userAvatar} className="message-icon" alt="user avatar" />
            <div className="message-text">{message.message}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={state.newMessage}
          onChange={(e) => updateState({ newMessage: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;