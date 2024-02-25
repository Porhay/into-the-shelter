export const isProduction: boolean = process.env.REACT_APP_NODE_ENV === 'production';
export const gatewayUrl: string = isProduction ? process.env.REACT_APP_GATEWAY_URL || '' : 'http://localhost:8000';
export const accountsUrl: string = isProduction ? process.env.REACT_APP_ACCOUNTS_URL || '' : 'http://localhost:8001';
export const timeout: number = 1000 * 60 * 5; // 5m
