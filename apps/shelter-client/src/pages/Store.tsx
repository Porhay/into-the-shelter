import '../styles/Store.scss';
import coinIcon from '../assets/icons/shelter-coin-icon.png';
import coinsBagIcon from '../assets/icons/coins-bag-icon.png';

const StorePage = () => {
  const onPayBlockClick = (amount: number) => {
    console.log(amount);
  };
  return (
    <div className="store-page-container">
      <div className="store-page">
        <div className="coin-wrapper">
          <div className="coin-container">
            <img src={coinIcon} className="coin-img" alt={''} />
            <p className="coin-text">{`${17} Coins`}</p>
          </div>
        </div>

        <div className="pay-blocks">
          <div className="pay-block" onClick={() => onPayBlockClick(10)}>
            <img src={coinsBagIcon} className="coins-bag-img" alt={''} />
            <div className="pay-text">10 Coins</div>
          </div>
          <div className="pay-block" onClick={() => onPayBlockClick(75)}>
            <img src={coinsBagIcon} className="coins-bag-img" alt={''} />
            <div className="pay-text">75 Coins</div>
          </div>
          <div className="pay-block" onClick={() => onPayBlockClick(150)}>
            <img src={coinsBagIcon} className="coins-bag-img" alt={''} />
            <div className="pay-text">150 Coins</div>
          </div>
          <div className="pay-block" onClick={() => onPayBlockClick(500)}>
            <img src={coinsBagIcon} className="coins-bag-img" alt={''} />
            <div className="pay-text">500 Coins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
