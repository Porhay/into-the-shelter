import React, { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import config from '../config';
import userAvatar from '../assets/images/profile-image-default.jpg';
import '../styles/Chat.scss';

interface IState {
  messages: Message[];
  newMessage: string;
}

interface Message {
  sender: string;
  message: string;
  icon: string;
}

const Chat: React.FC = () => {
  const [state, setState] = useState<IState>({ messages: [], newMessage: '' });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(config.gatewayUrl);

    socketRef.current.on('message', (data: Message) => {
      setState((prevState) => ({ ...prevState, messages: [...prevState.messages, data] }));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSendMessage = useCallback(() => {
    if (state.newMessage.trim() !== '') {
      socketRef.current?.emit('message', { sender: 'User', message: state.newMessage, icon: 'user' });
      setState((prevState) => ({ ...prevState, newMessage: '' }));
    }
  }, [state.newMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({ ...prevState, newMessage: e.target.value }));
  };

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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
