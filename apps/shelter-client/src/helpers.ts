import Cookies from 'js-cookie';
import { ROUTES, CHAR_TYPES } from './constants';

export type charListType = {
  type: string;
  icon: string;
  text: string;
  isRevealed: boolean;
}[];

class CookieHelper {
  saveCookie(key: string, value: string): void {
    Cookies.set(key, value);
  }

  setCookieWithMaxAge = (key: string, value: string, maxAge: number) => {
    document.cookie = `${key}=${value}; max-age=${maxAge}; path=/`;
  };

  updateCookie(key: string, newValue: string): void {
    const currentValue = this.getCookie(key);
    if (currentValue !== undefined) {
      this.saveCookie(key, newValue);
    }
  }

  getCookie(key: string): string | undefined {
    return Cookies.get(key);
  }

  removeCookie(key: string): void {
    return Cookies.remove(key);
  }

  removeAllCookies(): void {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      this.removeCookie(cookieName);
    });
  }

  getAllCookies(): Record<string, string> {
    return Cookies.get();
  }
}
export const cookieHelper = new CookieHelper();

/**
 * Return deshes instead of input string.
 * Example: halo -> ----
 */
export const deshCount = (string: string) => {
  const length: number = string.split('').length;
  const dashArr: string[] = [];
  for (let i = 0; i < length; i++) {
    dashArr.push('-');
  }
  return dashArr.join('');
};

interface KeyboardHandlerFunction {
  (): void;
}
export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  func: KeyboardHandlerFunction,
) => {
  if (e.key === 'Enter') {
    func();
  }
};

export const gameAvatarByPosition = (gameAvatars: any, position: number) => {
  try {
    const avatarObj =
      gameAvatars?.find(
        (elem: { metadata: { position: number } }) =>
          elem.metadata.position === position,
      ) || null;
    return avatarObj;
  } catch {
    return null;
  }
};

export const fillGameAvatars = (gameAvatars: any) => {
  // filter before use
  gameAvatars = gameAvatars.filter(
    (avatarObj: { downloadUrl: string }) => avatarObj.downloadUrl !== 'default',
  );

  const arr = [];
  const index = gameAvatars.length === 0 ? 3 : 4;
  for (let i = 0; i < index - gameAvatars.length; i++) {
    arr.push({
      downloadUrl: 'default',
      metadata: { position: 0 },
      fileId: 0,
    });
  }
  return [...arr, ...gameAvatars];
};

/**
 * Fills array with numbers just to make it length to be 8 every time.
 * @param arr
 * @returns
 */
export const fillWithNumbers = (arr: any[]): any[] => {
  const res = [];
  for (let i = 1; i < 8 - arr.length; i++) {
    res.push(i);
  }
  return [...arr, ...res];
};

export const getQueryParam = (name: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || null;
};

export const getLobbyLink = (roomId: string = '') => {
  return `${window.location.host}${ROUTES.ROOMS + '/' + roomId}`;
};

export class Char {
  constructor(public readonly type: string) {}

  public icon: string = `${this.type}Icon`;
  public text: string = ' ';
  public isRevealed: boolean = false;
}

/**
 * Defines standart characteristics list
 * @returns [
        { type: 'gender', icon: 'genderIcon', text: ' ', isRevealed: false },
        { type: 'health', icon: 'healthIcon', text: ' ', isRevealed: false },
        { type: 'hobby', icon: 'hobbyIcon', text: ' ', isRevealed: false },
        { type: 'job', icon: 'jobIcon', text: ' ', isRevealed: false },
        { type: 'phobia', icon: 'phobiaIcon', text: ' ', isRevealed: false },
        { type: 'backpack', icon: 'backpackIcon', text: ' ', isRevealed: false },
        { type: 'fact', icon: 'additionalInfoIcon', text: ' ', isRevealed: false },
    ]
 */
export const defineCharsList = (): any =>
  CHAR_TYPES.map((type) => new Char(type));

export const EMPTY_CHAR_LIST = defineCharsList();

/**
 * Currently it takes player object and updates its charList propery
 * with according icons for every type in that charList
 * @param players
 * @returns
 */
export const normalizePlayers = (players: any) => {
  for (const player of players) {
    const iconsList: { type: string; icon: string; text: string }[] = [];
    player.charList?.forEach((playerList: { type: string; text: string }) => {
      const match = defineCharsList().find(
        (defaultList: { type: string }) => defaultList.type === playerList.type,
      );
      if (match) {
        iconsList.push({ ...match, text: playerList.text });
      }
    });
    player.charList = iconsList;
  }
  return players;
};
