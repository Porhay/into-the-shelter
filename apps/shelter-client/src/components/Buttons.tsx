import '../styles/Buttons.scss';
import videocamIcon from '../assets/icons/videocam-icon.png';
import enterIcon from '../assets/icons/login/enter-icon.png';
import googleIcon from '../assets/icons/login/google-icon.png';
import googleColorIcon from '../assets/icons/login/google-color-icon.png';
import discordIcon from '../assets/icons/login/discord-icon.png';
import profileIcon from '../assets/icons/profile-icon.png';
import settingsIcon from '../assets/icons/settings-icon.png';
import exitIcon from '../assets/icons/login/exit-icon.png';
import plusIcon from '../assets/icons/plus-icon.png';
import genderIcon from '../assets/icons/ingame/gender-icon.png';
import healthIcon from '../assets/icons/ingame/health-icon.png';
import hobbyIcon from '../assets/icons/ingame/hobby-icon.png';
import jobIcon from '../assets/icons/ingame/job-icon.png';
import phobiaIcon from '../assets/icons/ingame/phobia-icon.png';
import backpackIcon from '../assets/icons/ingame/backpack-icon.png';
import additionalInfoIcon from '../assets/icons/ingame/additional-info-icon.png';
import specialCardIcon from '../assets/icons/ingame/special-card-icon.png';
import shelterIcon from '../assets/images/shelter-icon.png';
import catastropheIcon from '../assets/images/catastrophe-icon.png';

export const Icon = (props: any) => {
  const alt = 'icon';
  switch (props.icon) {
    case 'videocamIcon':
      return <img className={props.style} src={videocamIcon} alt={alt} />;
    case 'genderIcon':
      return <img src={genderIcon} alt={alt} />;
    case 'healthIcon':
      return <img src={healthIcon} alt={alt} />;
    case 'hobbyIcon':
      return <img src={hobbyIcon} alt={alt} />;
    case 'jobIcon':
      return <img src={jobIcon} alt={alt} />;
    case 'phobiaIcon':
      return <img src={phobiaIcon} alt={alt} />;
    case 'backpackIcon':
      return <img src={backpackIcon} alt={alt} />;
    case 'factIcon':
      return <img src={additionalInfoIcon} alt={alt} />;
    case 'enterIcon':
      return <img src={enterIcon} alt={alt} />;
    case 'googleIcon':
      return <img src={googleIcon} alt={alt} />;
    case 'googleColorIcon':
      return <img src={googleColorIcon} alt={alt} />;
    case 'discordIcon':
      return <img src={discordIcon} alt={alt} />;
    case 'profileIcon':
      return <img src={profileIcon} alt={alt} />;
    case 'settingsIcon':
      return <img src={settingsIcon} alt={alt} />;
    case 'exitIcon':
      return <img src={exitIcon} alt={alt} />;
    case 'plusIcon':
      return <img src={plusIcon} alt={alt} />;
    case 'specialCardIcon':
      return <img src={specialCardIcon} alt={alt} />;
    case 'shelterIcon':
      return <img src={shelterIcon} alt={alt} />;
    case 'catastropheIcon':
      return <img src={catastropheIcon} alt={alt} />;
    default:
      return <img src={healthIcon} alt={alt} />;
  }
};

type ButtonProps = {
  custom?: boolean;
  stylesheet?: string;
  icon?: string; // icon name if there's an icon
  text?: string; // text to display on button
  size?: 's' | 'm' | 'l'; // size variants, assuming 'm' and 'l' are also possible sizes
  onClick?: React.MouseEventHandler<HTMLAnchorElement>; // type for click handler
};
export const Button: React.FC<ButtonProps> = ({
  custom,
  stylesheet,
  icon,
  text,
  size,
  onClick,
}) => {
  let cssClass = 'text-button'; // Default class
  if (custom && stylesheet) {
    cssClass = stylesheet;
  } else if (!icon && text) {
    cssClass = 'text-button';
  } else if (icon && !text) {
    cssClass = 'icon-button';
  } else if (icon && text) {
    cssClass = 'icon-text-button';
  }

  if (size === 's') {
    cssClass += ' small';
  }

  return (
    <a className={cssClass} onClick={onClick}>
      {icon && <Icon icon={icon} />}
      {text && <span>{text}</span>}
    </a>
  );
};
