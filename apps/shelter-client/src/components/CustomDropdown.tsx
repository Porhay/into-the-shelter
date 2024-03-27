import React, { useEffect, useRef } from 'react';
import { Button } from './Buttons';
import '../styles/CustomDropdown.scss';

interface Item {
  icon?: React.ReactNode;
  type?: string;
  action?: () => void;
}

interface DropdownProps {
  children: React.ReactNode;
  isOpened: boolean;
  list: Item[];
  text: string;
  onClose: (type: string) => void;
  type: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  children,
  isOpened,
  list,
  text,
  onClose,
  type,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose(type);
      }
    }

    if (isOpened) document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpened, onClose, type]);

  const isTypeNotifications = type === 'notifications';
  return (
    <div className={`login-container`} ref={dropdownRef}>
      {children}
      {isOpened && (
        <div
          className={`drop-down-content ${isTypeNotifications && 'notifications-content'}`}
        >
          {(type === 'account' || type === 'login') && (
            <div className={'login-down-text'}>{text}</div>
          )}
          {type === 'notifications' && (
            <div className={'notifications-down-text'}>{text}</div>
          )}
          {list.map((item, index) => (
            <div className={'button-wraper'} key={index}>
              <Button icon={item.icon} text={item.type} onClick={item.action} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
