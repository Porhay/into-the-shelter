import Cookies from 'js-cookie';

export class CookieHelper {
    saveCookie(key: string, value: string): void {
        Cookies.set(key, value);
    }

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

    // Remove all cookies
    removeAllCookies(): void {
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach((cookieName) => {
            this.removeCookie(cookieName);
        });
    }
}


/**
 * Return deshes instead of input string.
 * Example: halo -> ----
 */
export const deshCount = (string: string) => {
    const length: number = string.split('').length
    const dashArr: string[] = []
    for (let i = 0; i < length; i++) {
        dashArr.push('-')
    }
    return dashArr.join('')
}

