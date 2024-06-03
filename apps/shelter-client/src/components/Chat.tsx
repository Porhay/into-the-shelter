import '../styles/Chat.scss';
import React, { FC, useEffect, useRef, useState } from 'react';
import userAvatar from '../assets/images/profile-image-default.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import useSocketManager from '../hooks/useSocketManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize } from '@fortawesome/free-solid-svg-icons';
import { getChatMessages } from '../api/requests';
import { useParams } from 'react-router-dom';

interface IState {
  messages: Message[];
  newMessage: string;
  isResizing: boolean;
  isPlayersSuggested: boolean;
  chatHeight: number;
  chatWidth: number;
  startX?: number;
  startY?: number;
  prevMessages: string[];
  currentMessageIndex: number;
}

interface Message {
  sender: string;
  message: string;
  avatar: string;
  timeSent: string;
}

const Chat: FC = () => {
  const { sm } = useSocketManager();
  const user = useSelector((state: RootState) => state.user);
  const lobby = useSelector((state: RootState) => state.lobby);
  const { roomId } = useParams();
  const chatRef = useRef<HTMLDivElement>(null);
  const messageTextRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    messages: [],
    newMessage: '',
    isResizing: false,
    isPlayersSuggested: false,
    chatHeight: 54,
    chatWidth: 20,
    prevMessages: [],
    currentMessageIndex: -1,
  });

  useEffect(() => {
    sm.socket.on('server.chat.message', (data: Message) => {
      if (data && data.message) {
        updateState({ messages: [...state.messages, data] });
      }
    });

    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [state.messages]);

  // set chat messages on mount/reload
  useEffect(() => {
    const setData = async () => {
      const chatMessages = await getChatMessages(roomId);
      updateState({ messages: chatMessages });
    };
    setData();
  }, []);

  // FUNCTIONS
  const handleSendMessage = () => {
    if (state.newMessage.trim() !== '') {
      const date = new Date();
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hour}:${minute}`;
      sm.socket.emit('client.chat.message', {
        sender: user.displayName,
        senderId: user.userId,
        message: state.newMessage,
        avatar: user.avatar,
        timeSent: timeStr,
      });
      updateState({
        newMessage: '',
        prevMessages: updateQueue(state.prevMessages, state.newMessage),
        currentMessageIndex: -1,
      });
    }
  };

  const startResizing = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    updateState({
      isResizing: true,
      startX: mouseDownEvent.clientX,
      startY: mouseDownEvent.clientY,
    });
    mouseDownEvent.preventDefault();
  };

  const resize = (mouseMoveEvent: MouseEvent) => {
    if (state.isResizing && chatRef.current) {
      if (state.startX && state.startY) {
        const newWidth =
          state.chatWidth -
          ((mouseMoveEvent.clientX - state.startX) / window.innerWidth) * 100;
        const newHeight =
          state.chatHeight -
          ((mouseMoveEvent.clientY - state.startY) / window.innerHeight) * 100;

        if (newHeight > 20 && newHeight < 80) {
          setState((prevState) => ({
            ...prevState,
            chatHeight: newHeight,
          }));
        }

        if (newWidth > 20 && newWidth < 80) {
          setState((prevState) => ({
            ...prevState,
            chatWidth: newWidth,
          }));
        }
      }
    }
  };

  const stopResizing = () => {
    updateState({ isResizing: false });
  };

  const handleInputChange = (e: any) => {
    if (e.target.value === '@') {
      updateState({ isPlayersSuggested: true });
    } else {
      updateState({ isPlayersSuggested: false });
    }
    updateState({ newMessage: e.target.value });
  };

  const handleSuggestedPlayerClick = (e: any) => {
    updateState({ isPlayersSuggested: false });
    updateState({ newMessage: `@${e.target.innerText}, ` });
    chatInputRef.current?.focus();
  };

  function updateQueue(array: string[], newMsg: string, limit = 5) {
    if (array.length >= limit) {
      array.shift(); // Remove the first element
    }
    array.push(newMsg);
    return array;
  }

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [state.isResizing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    } else if (e.key === 'ArrowUp') {
      if (state.currentMessageIndex === -1) {
        // Start from the latest added string
        updateState({
          newMessage: state.prevMessages[state.prevMessages.length - 1],
          currentMessageIndex: state.prevMessages.length - 1,
        });
      } else if (state.currentMessageIndex > 0) {
        // Continue in reverse order
        updateState({
          newMessage: state.prevMessages[state.currentMessageIndex - 1],
          currentMessageIndex: state.currentMessageIndex - 1,
        });
      }
    } else if (e.key === 'ArrowDown') {
      if (state.currentMessageIndex === -1) {
        // If at the beginning (empty string), do nothing
        return;
      }
      if (state.currentMessageIndex < state.prevMessages.length - 1) {
        // Move to the next message
        updateState({
          newMessage: state.prevMessages[state.currentMessageIndex + 1],
          currentMessageIndex: state.currentMessageIndex + 1,
        });
      } else {
        // If at the end, cycle back to empty string
        updateState({
          newMessage: '',
          currentMessageIndex: -1,
        });
      }
    }
  };

  return (
    <div
      className="chat-container"
      style={{
        height: `${state.chatHeight}vh`,
        width: `${state.chatWidth}vw`,
      }}
    >
      <div
        className="resize-handle"
        onMouseDown={startResizing}
        ref={resizeRef}
      >
        <FontAwesomeIcon className={'resize-handle-icon'} icon={faMaximize} />
      </div>
      <div className="messages-container" ref={chatRef}>
        {state.messages.map((message, index) => (
          <div className="message-wrapper" key={index}>
            <div className={'message'}>
              <img
                src={message.avatar || userAvatar}
                className="message-icon"
                alt="user avatar"
              />
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
      <div className="input-wrapper">
        <div className="input-container">
          {state.isPlayersSuggested && (
            <div className="suggested-player-wrapper">
              {lobby.players
                .filter(
                  (player: { userId: string }) => player.userId !== user.userId,
                )
                .map((player: any, index: number) => {
                  return (
                    <div
                      className="suggested-player"
                      onClick={handleSuggestedPlayerClick}
                    >
                      <p>{player.displayName}</p>
                    </div>
                  );
                })}
            </div>
          )}
          <input
            autoComplete="off"
            spellCheck="false"
            type="text"
            placeholder="Type your message..."
            value={state.newMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e)}
            ref={chatInputRef}
          />
        </div>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
