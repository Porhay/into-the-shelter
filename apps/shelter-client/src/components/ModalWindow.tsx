import '../styles/ModalWindow.scss';
import { useEffect, useRef } from 'react';

const ModalWindow = (props: any) => {
  const modalWindowBlock = useRef<HTMLDivElement>(null);

  // FUNCTIONS
  function closeModal() {
    props.handleOpenModal(false);
  }

  useEffect(() => {
    const clickOutsideHandler = (e: any) => {
      if (
        modalWindowBlock.current &&
        !modalWindowBlock.current?.contains(e.target)
      ) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', clickOutsideHandler);
  }, []);

  return (
    <div className="modal-window-container">
      <div className="modal-window-block" ref={modalWindowBlock}>
        <div className="close-block">
          <span
            className="close"
            onClick={(e: any) => {
              closeModal();
            }}
          ></span>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default ModalWindow;
