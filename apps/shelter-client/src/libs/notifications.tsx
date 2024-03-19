import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NOTIF_TYPE } from '../constants'

export const showNotification = (type: string, text: string) => {
    const options: any = {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    }

    switch (type) {
        case NOTIF_TYPE.SUCCESS:
            toast.success(text, options);
            break;
        case NOTIF_TYPE.WARN:
            toast.warn(text, options);
            break;
        case NOTIF_TYPE.ERROR:
            toast.error(text, options);
            break;
        case NOTIF_TYPE.INFO:
            toast.info(text, options);
            break;
        default:
            break;
    }
}

export const Notification = () => {
    return (
        <ToastContainer
            position="bottom-center"
            autoClose={1000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="dark"
        />
    )
}
