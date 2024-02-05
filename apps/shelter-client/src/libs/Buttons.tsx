import '../styles/Buttons.scss';
import videocamIcon from '../assets/icons/videocam-icon.png'
import genderIcon from '../assets/icons/ingame/white/gender-icon.png';
import healthIcon from '../assets/icons/ingame/white/health-icon.png';
import hobbyIcon from '../assets/icons/ingame/white/hobby-icon.png';
import jobIcon from '../assets/icons/ingame/white/job-icon.png';
import phobiaIcon from '../assets/icons/ingame/white/phobia-icon.png';
import backpackIcon from '../assets/icons/ingame/white/backpack-icon.png';


const Icon = (props: any) => {
    switch (props.icon) {
        case 'videocamIcon': return <img src={videocamIcon} />
        case 'genderIcon': return <img src={genderIcon} />
        case 'healthIcon': return <img src={healthIcon} />
        case 'hobbyIcon': return <img src={hobbyIcon} />
        case 'jobIcon': return <img src={jobIcon} />
        case 'phobiaIcon': return <img src={phobiaIcon} />
        case 'backpackIcon': return <img src={backpackIcon} />
        default: return <img src={healthIcon} />
    }
}

export const Button = (props: any) => {
    let stylesheet = "text-button"
    switch (true) {
        case !props.icon && props.text:
            stylesheet = "text-button"
            break;
        case props.icon && !props.text:
            stylesheet = "icon-button"
            break;
        case props.icon && props.text:
            stylesheet = "icon-text-button"
            break;
    }

    return (
        <a className={stylesheet} onClick={props.onClick}>
            {props.icon ? <Icon icon={props.icon} /> : null}
            {props.text ? <span style={{marginLeft: 2}}>{props.text}</span> : null}
        </a>
    )
}