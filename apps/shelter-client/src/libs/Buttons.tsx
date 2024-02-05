import '../styles/Buttons.scss';
import videocamIcon from '../assets/icons/videocam-icon.png'
import genderIcon from '../assets/icons/ingame/gender-icon.png';
import healthIcon from '../assets/icons/ingame/health-icon.png';
import hobbyIcon from '../assets/icons/ingame/hobby-icon.png';
import jobIcon from '../assets/icons/ingame/job-icon.png';
import phobiaIcon from '../assets/icons/ingame/phobia-icon.png';


const Icon = (props: any) => {
    switch (props.icon) {
        case 'videocamIcon': return <img src={videocamIcon} />
        case 'genderIcon': return <img src={genderIcon} />
        case 'healthIcon': return <img src={healthIcon} />
        case 'hobbyIcon': return <img src={hobbyIcon} />
        case 'jobIcon': return <img src={jobIcon} />
        case 'phobiaIcon': return <img src={phobiaIcon} />
        default: return <img src={healthIcon} />
    }
}

const TextButton = (props: any) => {
    return (
        <a className='text-button' onClick={props.onClick}>
            <span style={{marginLeft: 2}}>{props.text}</span>
        </a>
    )
}

export const IconButton = (props: any) => {
    return (
        <a className="icon-button" onClick={props.onClick}>
            <Icon icon={props.icon} />
        </a>
    )
}

export {TextButton}