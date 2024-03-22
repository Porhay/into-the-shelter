import Cookies from 'js-cookie';
import { CHAR_LIST, ROUTES } from './constants';

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

export const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    func: Function,
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
        (avatarObj: { downloadUrl: string }) =>
            avatarObj.downloadUrl !== 'default',
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


/**
 * Currently it takes player object and updates its charList propery
 * with according icons for every type in that charList
 * @param players 
 * @returns 
 */
export const normalizePlayers = (players: any) => {
    for (const player of players) {
        const listWithIcons: { type: string; icon: string; text: string; }[] = [];
        if (player.charList) {
            player.charList.forEach((playerList: { type: string; text: string; }) => {
                const match = CHAR_LIST.find((defaultList) => defaultList.type === playerList.type);
                if (match) {
                    listWithIcons.push({ ...match, text: playerList.text });
                }
            });
        }
        player.charList = listWithIcons;
    }
    return players;
};
