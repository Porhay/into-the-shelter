import '../styles/Chat.scss'
import { FC, useEffect, useRef, useState } from 'react';
import userAvatar from '../assets/images/profile-image-default.jpg';
import io from 'socket.io-client';
import * as config from '../config'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { handleKeyDown } from '../helpers'
import useSocketManager from '../hooks/useSocketManager';


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

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    messages: [],
    newMessage: '',
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
          onChange={e => updateState({ newMessage: e.target.value })}
          onKeyDown={e => handleKeyDown(e, handleSendMessage)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
