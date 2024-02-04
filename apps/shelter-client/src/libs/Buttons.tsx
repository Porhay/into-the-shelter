import '../styles/Buttons.scss';
import videocamIcon from '../assets/icons/videocam-icon.png'

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
            <img src={videocamIcon} />
        </a>
    )
}

export {TextButton}