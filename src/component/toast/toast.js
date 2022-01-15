import { toastTrigger } from "../../stores";

export const show = (message, type, duration) => {
    toastTrigger.set({
        message: message,
        type: type,
        duration: duration
    });
}