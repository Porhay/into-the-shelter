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

export const CHAR_LIST = [
    { type: 'gender', icon: 'genderIcon', text: ' ' },
    { type: 'health', icon: 'healthIcon', text: ' ' },
    { type: 'hobby', icon: 'hobbyIcon', text: ' ' },
    { type: 'job', icon: 'jobIcon', text: ' ' },
    { type: 'phobia', icon: 'phobiaIcon', text: ' ' },
    { type: 'backpack', icon: 'backpackIcon', text: ' ' },
    { type: 'fact', icon: 'additionalInfoIcon', text: ' ' },
]