import { confirmationTrigger } from "../../stores";

export const confirm = (message, confirmText, onConfirm, onCancel) => {
    confirmationTrigger.set({
        message: message,
        confirmText: confirmText,
        onConfirm: onConfirm,
        onCancel: onCancel
    });
}