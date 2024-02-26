import { useEffect, useState } from 'react';
import '../styles/Welcome.scss'

interface IState {
    reloaded: boolean;
}

const WelcomePage = () => {
    const description: string =
        `Into the shelter - it's discussion based game where\n` +
        `you should prove other players that you should go to the shelter.\n` +
        `Be careful, other people will do the same!\n` +
        `Every discussion all the players should deside who should leave them\n` +
        `and die beyound the shelter.\n\n` +
        `Only half will survive!\n` +
        `- or not :D`

    // LOCAL STATE
    const updateState = (newState: Partial<IState>): void => setState((prevState) => ({ ...prevState, ...newState }));
    const [state, setState] = useState<IState>({
        reloaded: false
    });

    useEffect(() => {
        // Function to extract parameters from the URL
        const getQueryParam = (name: string): string | null => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        };

        // Extract userId and userSessionId from the URL parameters
        const userId = getQueryParam('userId');
        const userSessionId = getQueryParam('userSessionId');

        // Set cookies on the client side
        const setCookie = (name: string, value: string, maxAge: number) => {
            document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
        };

        if (userId && userSessionId) {
            // Set cookies with extracted values
            setCookie('userId', userId, 30 * 24 * 60 * 60); // 30 days
            setCookie('userSessionId', userSessionId, 30 * 24 * 60 * 60); // 30 days

            // trigger a page reload
            updateState({ reloaded: true });
        }

        // remove the parameters from the URL
        const newUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);

    }, []);

    return (
        <div className="welcome-page-container">
            <pre>
                {description}
            </pre>
        </div>
    )
}

export default WelcomePage;
