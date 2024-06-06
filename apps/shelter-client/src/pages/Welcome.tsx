import { useEffect } from 'react';
import { cookieHelper } from '../helpers';
import '../styles/Welcome.scss';

const WelcomePage = () => {
  const description: string =
    `Into the shelter - it's discussion based game where\n` +
    `you should prove other players that you should go to the shelter.\n` +
    `Be careful, other people will do the same!\n` +
    `Every discussion all the players should deside who should leave them\n` +
    `and die beyound the shelter.\n\n` +
    `Only half will survive!\n` +
    `- or not :D`;

  useEffect(() => {
    // TODO: Rework in secure way
    const _getQueryParam = (name: string): string | null => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    };

    const userId = _getQueryParam('userId');
    const userSessionId = _getQueryParam('userSessionId');
    if (userId && userSessionId) {
      cookieHelper.setCookieWithMaxAge('userId', userId, 30 * 24 * 60 * 60); // 30 days
      cookieHelper.setCookieWithMaxAge(
        'userSessionId',
        userSessionId,
        30 * 24 * 60 * 60,
      );

      // remove parameters from URL
      const newUrl = window.location.href.split('?')[0];
      window.history.replaceState({}, document.title, newUrl);

      // Reload the page after setting cookies and updating URL
      window.location.reload();
    }
  }, []);

  return (
    <div className="welcome-page-container">
      <pre>{description}</pre>
    </div>
  );
};

export default WelcomePage;
