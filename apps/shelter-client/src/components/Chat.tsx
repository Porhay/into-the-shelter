import '../styles/Chat.scss'
import React, { FC, useEffect, useRef, useState } from 'react';
import userAvatar from '../assets/images/profile-image-default.jpg';
import io from 'socket.io-client';
import * as config from '../config'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { handleKeyDown } from '../helpers'
import useSocketManager from '../hooks/useSocketManager';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize } from '@fortawesome/free-solid-svg-icons';

interface IState {
  messages: Message[];
  newMessage: string;
  isResizing: boolean;
  chatHeight: number;
  chatWidth: number
  startX?: number;
  startY?: number;
}

interface Message {
  sender: string;
  message: string;
  avatar: string;
  timeSent: string;
}

// const socket = io(config.gatewayUrl as string, {
//   autoConnect: true,
//   path: '/wsapi',
//   transports: ['websocket'],
//   withCredentials: true,
// });



const Chat: FC = () => {
  const { sm } = useSocketManager();
  const user = useSelector((state: RootState) => state.user);
  const chatRef = useRef<HTMLDivElement>(null)
  const messageTextRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null);

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    messages: [],
    newMessage: '',
    isResizing: false,
    chatHeight: 54,
    chatWidth: 20,
  });

  useEffect(() => {
    sm.socket.on('server.chat.message', (data: Message) => {
      console.log('Chat', data);

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
      sm.socket.emit('client.chat.message', {
        sender: user.displayName,
        message: state.newMessage,
        avatar: user.avatar,
        timeSent: dateStr
      })
      updateState({ newMessage: '' });
    }
  };

  const startResizing = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    updateState({
      isResizing: true,
      startX: mouseDownEvent.clientX,
      startY: mouseDownEvent.clientY
    });
    mouseDownEvent.preventDefault();
  };

  const resize = (mouseMoveEvent: MouseEvent) => {
    if (state.isResizing && chatRef.current) {
      if (state.startX && state.startY) {
        const newWidth = state.chatWidth - (mouseMoveEvent.clientX - state.startX) / window.innerWidth * 100;
        const newHeight = state.chatHeight - (mouseMoveEvent.clientY - state.startY) / window.innerHeight * 100;

        if (newHeight > 20 && newHeight < 80) {
          setState(prevState => ({ ...prevState, chatHeight: newHeight }));
        }

        if (newWidth > 20 && newWidth < 80) {
          setState(prevState => ({ ...prevState, chatWidth: newWidth }));
        }
      }
    }
  };

  const stopResizing = () => {
    updateState({ isResizing: false });
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [state.isResizing]);

  return (
    <div
      className="chat-container"
      style={{ height: `${state.chatHeight}vh`, width: `${state.chatWidth}vw` }}
    >
      <div className="resize-handle" onMouseDown={startResizing} ref={resizeRef}>
        <FontAwesomeIcon
          className={'resize-handle-icon'}
          icon={faMaximize}
        />
      </div>
      <div className="messages-container" ref={chatRef}>
        {state.messages.map((message, index) => (
          <div className="message-wrapper" key={index}>
            <div className={'message'}>
              <img src={message.avatar || userAvatar} className="message-icon" alt="user avatar" />
              <div ref={messageTextRef} className="message-container">
                <div className="message-data">
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-time">{message.timeSent}</div>
                </div>
                <div className="message-text">{message.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={state.newMessage}
          onChange={e => updateState({ newMessage: e.target.value })}
          onKeyDown={e => handleKeyDown(e, handleSendMessage)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
