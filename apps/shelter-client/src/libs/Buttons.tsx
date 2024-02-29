import '../styles/Buttons.scss';
import videocamIcon from '../assets/icons/videocam-icon.png'
import enterIcon from '../assets/icons/enter-icon.png';
import googleIcon from '../assets/icons/google-icon.png';
import googleColorIcon from '../assets/icons/google-color-icon.png';
import discordIcon from '../assets/icons/discord-icon.png';
import profileIcon from '../assets/icons/profile-icon.png';
import settingsIcon from '../assets/icons/settings-icon.png';
import exitIcon from '../assets/icons/exit-icon.png';
import plusIcon from '../assets/icons/plus-icon.png';
import genderIcon from '../assets/icons/ingame/gender-icon.png';
import healthIcon from '../assets/icons/ingame/health-icon.png';
import hobbyIcon from '../assets/icons/ingame/hobby-icon.png';
import jobIcon from '../assets/icons/ingame/job-icon.png';
import phobiaIcon from '../assets/icons/ingame/phobia-icon.png';
import backpackIcon from '../assets/icons/ingame/backpack-icon.png';
import additionalInfoIcon from '../assets/icons/ingame/additional-info-icon.png';



const Icon = (props: any) => {
    const alt = 'icon'
    switch (props.icon) {
        case 'videocamIcon': return <img className={props.style} src={videocamIcon} alt={alt} />
        case 'genderIcon': return <img src={genderIcon} alt={alt} />
        case 'healthIcon': return <img src={healthIcon} alt={alt} />
        case 'hobbyIcon': return <img src={hobbyIcon} alt={alt} />
        case 'jobIcon': return <img src={jobIcon} alt={alt} />
        case 'phobiaIcon': return <img src={phobiaIcon} alt={alt} />
        case 'backpackIcon': return <img src={backpackIcon} alt={alt} />
        case 'additionalInfoIcon': return <img src={additionalInfoIcon} alt={alt} />
        case 'enterIcon': return <img src={enterIcon} alt={alt} />
        case 'googleIcon': return <img src={googleIcon} alt={alt} />
        case 'googleColorIcon': return <img src={googleColorIcon} alt={alt} />
        case 'discordIcon': return <img src={discordIcon} alt={alt} />
        case 'profileIcon': return <img src={profileIcon} alt={alt} />
        case 'settingsIcon': return <img src={settingsIcon} alt={alt} />
        case 'exitIcon': return <img src={exitIcon} alt={alt} />
        case 'plusIcon': return <img src={plusIcon} alt={alt} />
        default: return <img src={healthIcon} alt={alt} />
    }
}

export const Button = (props: any) => {
    let stylesheet = "text-button"
    switch (true) {
        case props.custom:
            stylesheet = props.stylesheet
            break;
        case !props.icon && props.text:
            stylesheet = "text-button"
            break;
        case props.icon && !props.text:
            stylesheet = "icon-button"
            break;
        case !!props.icon && !!props.text:
            stylesheet = "icon-text-button"
            break;
    }    

    if (props.size === "s") {
        stylesheet = stylesheet += " small"
    }

    return (
        <a className={stylesheet} onClick={props.onClick} href="javascript:;">
            {props.icon ? <Icon icon={props.icon} /> : null}
            {props.text ? <span>{props.text}</span> : null}
        </a>
    )
}