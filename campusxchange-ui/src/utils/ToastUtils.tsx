import { toast } from 'react-toastify'

export class ToastUtil {
    public static displayInfoToast(message: string) {
        return toast.info(message)
    }

    public static displaySuccessToast(message: string) {
        return toast.success(message)
    }

    public static displayErrorToast(message: string) {
        return toast.error(message)
    }
}
