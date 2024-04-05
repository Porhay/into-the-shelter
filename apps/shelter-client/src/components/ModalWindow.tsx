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
        <div
          className="close"
          onClick={(e: any) => {
            closeModal();
          }}
        ></div>

        <div className="modal-info-wrapper">
          {props.type === 'shelter' || props.type === 'catastrophe' ? (
            <div className="info-title">
              <h3>
                {props.type}: <span>{props.title}</span>
              </h3>
            </div>
          ) : (
            <h3>{props.type}</h3>
          )}

          <div className={`modal-info ${props.type}`}>
            {props.type === 'shelter' || props.type === 'catastrophe' ? (
              <div className="description">
                <p>{props.description}</p>
              </div>
            ) : null}

            {/* ALSO WILL BE PROPS.TYPE = RULES. IT WILL PROBABLY LOOK IN ANOTHER WAY */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
