import * as config from './config';

export const ROUTES = {
    /* Pages */
    MAIN: '/',
    WELCOME: '/welcome',
    ROOMS: '/rooms',
    SETTINGS: '/settings',
    PROFILE: '/profile',

    /* All other */
    GOOGLE_LOGIN: config.accountsUrl + '/api/auth/google/login',
};

export const NOTIF_TYPE = {
    SUCCESS: 'success',
    WARN: 'warn',
    ERROR: 'error',
    INFO: 'info',
};

export const CHAR_TYPES = [
    'gender',
    'health',
    'hobby',
    'job',
    'phobia',
    'backpack',
    'fact',
];
