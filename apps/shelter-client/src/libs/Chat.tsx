import '../styles/Chat.scss'
import React, { FC, useEffect, useRef, useState } from 'react';
import userAvatar from '../assets/images/profile-image-default.jpg';
import io from 'socket.io-client';
import * as config from '../config'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface IState {
  messages: Message[];
  newMessage: string;
}

interface Message {
  sender: string;
  message: string;
  avatar: string;
  timeSent: string;
}

const socket = io(config.gatewayUrl);

const Chat: FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const chatRef = useRef<HTMLDivElement>(null)
  const messageTextRef = useRef<HTMLDivElement>(null)

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    messages: [],
    newMessage: '',
  });



  useEffect(() => {
    socket.on('message', (data: Message) => {
      if (data && data.message) {
        updateState({ messages: [...state.messages, data] });
      }
    });

    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [state.messages]);


  // FUNCTIONS
  const handleSendMessage = () => {
    if (state.newMessage.trim() !== '') {
      const date = new Date()
      const dateStr = `${date.getHours()}:${date.getMinutes()}`
      socket.emit('message', { sender: user.displayName, message: state.newMessage, avatar: user.avatar, timeSent: dateStr });
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
      <div className="messages-container" ref={chatRef}>
        {state.messages.map((message, index) => (
          <div className="message" key={index}>
            <img src={message.avatar || userAvatar} className="message-icon" alt="user avatar" />
            <div ref={messageTextRef} className="message-container">
              <div className='message-data'>
                <p className='message-sender'>{message.sender}</p>
                <p className='message-time'>{message.timeSent}</p>
              </div>
              <p className='message-text'>{message.message}</p>
            </div>
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
