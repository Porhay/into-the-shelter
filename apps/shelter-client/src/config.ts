import icon1 from './assets/icons/pay/1.png';
import icon2 from './assets/icons/pay/2.png';
import icon3 from './assets/icons/pay/3.png';
import icon4 from './assets/icons/pay/4.png';
import icon101 from './assets/icons/pay/101.png';
import icon102 from './assets/icons/pay/102.png';

// enviroment
export const isProduction: boolean =
  process.env.REACT_APP_NODE_ENV === 'production';
export const gatewayUrl: string = isProduction
  ? process.env.REACT_APP_GATEWAY_URL || ''
  : 'http://localhost:8000';
export const accountsUrl: string = isProduction
  ? process.env.REACT_APP_ACCOUNTS_URL || ''
  : 'http://localhost:8001';
export const timeout: number = 1000 * 60 * 5; // 5m

// store details
export const storeDetails: {
  [key: string]: {
    icon: string;
    info: { title: string; description?: string };
    price: string;
  };
} = {
  // buy coins details, info coins count, price in dolars
  '1': { icon: icon1, info: { title: '20' }, price: '1' },
  '2': { icon: icon2, info: { title: '100' }, price: '3' },
  '3': { icon: icon3, info: { title: '200' }, price: '5' },
  '4': { icon: icon4, info: { title: '440' }, price: '10' },

  // buy product icons, info description, price in coins
  '101': {
    icon: icon101,
    info: {
      title: 'Turn off Ads',
      description: 'Have the best game experience, free from all ads.',
    },
    price: '80',
  },
  '102': {
    icon: icon102,
    info: {
      title: 'Improved bots',
      description:
        'All bots from that moment will start explaining in chat why they should stay at shelter.',
    },
    price: '60',
  },
};
export const buyList: { coins: string[]; products: string[] } = {
  coins: ['1', '2', '3', '4'],
  products: ['101', '102'],
};
