import '../styles/Buttons.scss';
import videocamIcon from '../assets/icons/videocam-icon.png'
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
        default: return <img src={healthIcon} alt={alt} />
    }
}

export const Button = (props: any) => {
    let stylesheet = "text-button"
    switch (true) {
        case props.bottomList:
            stylesheet = "bottom-icon"
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

    return (
        <a className={stylesheet} onClick={props.onClick} href="javascript:;">
            {props.icon ? <Icon icon={props.icon} /> : null}
            {props.text ? <span>{props.text}</span> : null}
        </a>
    )
}