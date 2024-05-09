import * as config from './config';

export const ROUTES = {
  /* Pages */
  MAIN: '/',
  WELCOME: '/welcome',
  ROOMS: '/rooms',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  STORE: '/store',

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

export const gameDescription: string = `
You are participating in a competitive game called "Into The Shelter." The game has two stages that repeat until half of the players are eliminated from the shelter.

Stage 1: Open Stage
In this stage, each player must choose two characteristics to reveal to all other players. Then you need to explain why these characteristics make you a pretendent to the shelter's survival. Once everyone has revealed their characteristics, the game moves to the second stage.

Stage 2: Kick Stage
Here, players vote to kick someone from the shelter. You should vote for the contestant you think is the weakest link or who may be hiding something that could threaten the group's survival. After the votes are tallied, the player with the most votes is eliminated from the shelter, and the game returns to the Open Stage.

The game ends when half of the players are kicked off. At that point, the system reveals the final prediction, including each player's backstory and the fate of those who didn't make it into the shelter.

Special Cards
Each player starts with two special cards that can be used at any time during the game until during the final prediction. Use these wisely to enhance your chances of staying in the shelter.

Your Goal
To stay in the shelter, you must persuade the other contestants that you are a valuable member of the group. Choose the best characteristics to reveal, explain why they are crucial for survival, and prove that you are important. Good luck!
`;
