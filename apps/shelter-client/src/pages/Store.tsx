import '../styles/Store.scss';
import React, { useState } from 'react';
import coinIcon from '../assets/icons/shelter-coin-icon.png';
import ModalWindow from '../components/ModalWindow';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import * as requests from '../api/requests';

import icon20 from '../assets/icons/pay/20.png';
import icon50 from '../assets/icons/pay/50.png';
import icon150 from '../assets/icons/pay/150.png';
import icon275 from '../assets/icons/pay/275.png';

import allIcon from '../assets/icons/store/all.png';
import coinsIcon from '../assets/icons/store/coins.png';

interface IState {
  isPayModalOpened: boolean;
  tab: string;
}

// Renders errors or successfull transactions on the screen.
function Message({ content }: any) {
  return <p>{content}</p>;
}

const StorePage = () => {
  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    isPayModalOpened: false,
    tab: 'coins', // all, coins
  });

  const initialOptions: any = {
    'client-id': 'test',
    'enable-funding': 'paylater,venmo,card',
    'disable-funding': '',
    'data-sdk-integration-source': 'integrationbuilder_sc',
  };

  const [message, setMessage] = useState('');

  // FUNCTIONS
  const onPayBlockClick = (amount: number) => {
    console.log(amount);
    handleOpenPayModal(true);
  };

  const handleOpenPayModal = (isOpened: boolean) => {
    updateState({
      isPayModalOpened: isOpened,
    });
  };
  const handleNavTab = (type: string) => {
    updateState({ tab: type });
  };

  // COMPONENTS
  const Card = (props: any) => {
    let img;
    switch (props.coins) {
      case '20':
        img = icon20;
        break;
      case '50':
        img = icon50;
        break;
      case '150':
        img = icon150;
        break;
      case '275':
        img = icon275;
        break;
      default:
        img = icon20;
        break;
    }
    return (
      <div className="pay-block" onClick={() => onPayBlockClick(props.price)}>
        <div className="coins-bag">
          <img className="bag-img" src={img} alt={''} />
        </div>
        <div className="coins-count">
          <p>{`${props.coins} Coins`}</p>
        </div>
        <div className="price-count">{`$${props.price}`}</div>
      </div>
    );
  };

  return (
    <div className="store-page-container">
      <div className="store-page">
        <div className="store-navigation">
          <div
            className="navigation-tab-wrapper"
            onClick={() => handleNavTab('all')}
          >
            <div className="navigation-tab-container">
              <div className="navigation-tab-img-container">
                <img src={allIcon} className="navigation-tab-img" alt={''} />
              </div>
            </div>
          </div>

          <div
            className="navigation-tab-wrapper"
            onClick={() => handleNavTab('coins')}
          >
            <div className="navigation-tab-container">
              <div className="navigation-tab-img-container">
                <img src={coinsIcon} className="navigation-tab-img" alt={''} />
              </div>
            </div>
          </div>

          <div
            className="navigation-tab-wrapper"
            onClick={() => handleNavTab('coins')}
          >
            <div className="navigation-tab-container">
              <div className="coin-img-container">
                <img src={coinIcon} className="coin-img" alt={''} />
              </div>
              <p className="navigation-tab-text">{`${17} Coins`}</p>
            </div>
          </div>
        </div>
        {state.tab === 'coins' && (
          <div className="pay-blocks">
            <Card coins={'20'} price={'0.5'} />
            <Card coins={'50'} price={'1'} />
            <Card coins={'150'} price={'3'} />
            <Card coins={'275'} price={'5'} />
          </div>
        )}
      </div>
      {state.isPayModalOpened && (
        <ModalWindow handleOpenModal={handleOpenPayModal}>
          <div className="modal-info-wrapper">
            <div className="modal-info">
              <div className="description">
                <div className="App">
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      style={{
                        shape: 'rect',
                        layout: 'vertical',
                      }}
                      createOrder={async () => {
                        try {
                          const orderData = await requests.createOrder();
                          if (orderData.id) {
                            return orderData.id;
                          } else {
                            const errorDetail = orderData?.details?.[0];
                            const errorMessage = errorDetail
                              ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                              : JSON.stringify(orderData);

                            throw new Error(errorMessage);
                          }
                        } catch (error) {
                          console.error(error);
                          setMessage(
                            `Could not initiate PayPal Checkout...${error}`,
                          );
                        }
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const orderData = await requests.captureOrder({
                            orderId: '1',
                          });
                          // Three cases to handle:
                          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                          //   (2) Other non-recoverable errors -> Show a failure message
                          //   (3) Successful transaction -> Show confirmation or thank you message

                          const errorDetail = orderData?.details?.[0];

                          if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
                            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                            return actions.restart();
                          } else if (errorDetail) {
                            // (2) Other non-recoverable errors -> Show a failure message
                            throw new Error(
                              `${errorDetail.description} (${orderData.debug_id})`,
                            );
                          } else {
                            // (3) Successful transaction -> Show confirmation or thank you message
                            // Or go to another URL:  actions.redirect('thank_you.html');
                            const transaction =
                              orderData.purchase_units[0].payments.captures[0];
                            setMessage(
                              `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
                            );
                            console.log(
                              'Capture result',
                              orderData,
                              JSON.stringify(orderData, null, 2),
                            );
                          }
                        } catch (error) {
                          console.error(error);
                          setMessage(
                            `Sorry, your transaction could not be processed...${error}`,
                          );
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                  <Message content={message} />
                </div>
              </div>
            </div>
          </div>
        </ModalWindow>
      )}
    </div>
  );
};

export default StorePage;
