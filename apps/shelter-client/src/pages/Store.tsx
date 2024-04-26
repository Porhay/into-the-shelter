import '../styles/Store.scss';
import allIcon from '../assets/icons/store/all.png';
import coinsIcon from '../assets/icons/store/coins.png';
import React, { useState } from 'react';
import coinIcon from '../assets/icons/shelter-coin-icon.png';
import ModalWindow from '../components/ModalWindow';
import { Button } from '../components/Buttons';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import * as requests from '../api/requests';
import { storeDetails, buyList } from '../config';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { showNotification } from '../libs/notifications';
import { NOTIF_TYPE } from '../constants';
import { checkProduct } from '../helpers';

interface IState {
  isPayModalOpened: boolean;
  tab: string;
  productId: string | null;
}

// Renders errors or successfull transactions on the screen.
function Message({ content }: any) {
  return <p>{content}</p>;
}

const StorePage = () => {
  const user = useSelector((state: RootState) => state.user);

  // LOCAL STATE
  const updateState = (newState: Partial<IState>): void =>
    setState((prevState) => ({ ...prevState, ...newState }));
  const [state, setState] = useState<IState>({
    isPayModalOpened: false,
    tab: 'coins', // all, coins
    productId: null,
  });

  const initialOptions: any = {
    'client-id': 'test',
    'enable-funding': 'paylater,venmo,card',
    'disable-funding': '',
    'data-sdk-integration-source': 'integrationbuilder_sc',
  };

  const [message, setMessage] = useState('');

  // FUNCTIONS
  const onPayBlockClick = (productId: string, isOwned: boolean) => {
    if (isOwned) {
      showNotification(NOTIF_TYPE.INFO, 'You already own this product!');
      return;
    }
    updateState({
      productId: productId,
      isPayModalOpened: true,
    });
  };

  const handleOpenPayModal = (isOpened: boolean) => {
    updateState({
      isPayModalOpened: isOpened,
    });
  };
  const handleNavTab = (type: string) => {
    updateState({ tab: type });
  };
  const handleBuyProduct = (productId: string) => {
    const userProduct = requests
      .createUserProduct(user.userId, productId)
      .then(() => {
        showNotification(NOTIF_TYPE.SUCCESS, 'Product activated successfully!');
      })
      .catch((error) => {
        showNotification(NOTIF_TYPE.ERROR, error.message);
      });
    updateState({ isPayModalOpened: false });
  };

  // COMPONENTS
  type CardProps = {
    productId: string;
    type?: string;
  };
  const Card = ({ type = state.tab, ...props }: CardProps) => {
    const current = storeDetails[props.productId];

    const isOwned = checkProduct(user.userProducts!, props.productId);
    const priceIfAvaliable = isOwned ? `Owned` : `${current.price} Coins`;

    return (
      <div
        className="pay-block"
        onClick={() => onPayBlockClick(props.productId, isOwned)}
      >
        <div className="img-container">
          <img
            className="pay-block-img"
            src={current.icon}
            alt={`Product ${props.productId}`}
          />
        </div>
        {type === 'all' && (
          <>
            <div className="info">
              <p>{`${current.info.title}`}</p>
            </div>
            <div className="price-count">{priceIfAvaliable}</div>
          </>
        )}
        {type === 'coins' && (
          <>
            <div className="info">
              <p>{`${current.info.title} Coins`}</p>
            </div>
            <div className="price-count">{`$${current.price}`}</div>
          </>
        )}
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
              <p className="navigation-tab-text">{`${user.coins} Coins`}</p>
            </div>
          </div>
        </div>
        {state.tab === 'coins' && (
          <div className="pay-blocks">
            <Card productId={'1'} />
            <Card productId={'2'} />
            <Card productId={'3'} />
            <Card productId={'4'} />
          </div>
        )}
        {state.tab === 'all' && (
          <div className="pay-blocks">
            <Card productId={'101'} />
            <Card productId={'102'} />
          </div>
        )}
      </div>
      {state.isPayModalOpened && (
        <ModalWindow handleOpenModal={handleOpenPayModal}>
          <div className="modal-info-wrapper">
            <div className="modal-info">
              <div className="description">
                {buyList.coins.includes(state.productId!) && (
                  <>
                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        style={{
                          shape: 'rect',
                          layout: 'vertical',
                        }}
                        createOrder={async () => {
                          try {
                            const orderData = await requests.createOrder(
                              user.userId,
                              state.productId,
                            );
                            console.log('orderData', orderData);
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
                            const orderData = await requests.captureOrder(
                              user.userId,
                              {
                                orderId: data.orderID,
                              },
                            );
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
                                orderData.purchase_units[0].payments
                                  .captures[0];
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
                  </>
                )}
                {buyList.products.includes(state.productId!) && (
                  <>
                    <div className="modal-product-description">
                      <img src={storeDetails[state.productId!].icon} />
                      {`${storeDetails[state.productId!].info.title}. ${storeDetails[state.productId!].info.description}`}
                    </div>
                    <Button
                      text="BUY"
                      onClick={() => handleBuyProduct(state.productId!)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </ModalWindow>
      )}
    </div>
  );
};

export default StorePage;
