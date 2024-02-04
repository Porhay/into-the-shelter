import '../styles/Buttons.css';

const TextButton = (props: any) => {
    return (
        <a className='text-button' onClick={props.onClick}>
            <span style={{marginLeft: 2}}>{props.text}</span>
        </a>
    )
}

export {TextButton}