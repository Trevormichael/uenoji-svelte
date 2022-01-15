<script>
    import { slide, fade } from "svelte/transition";
    import { backOut } from "svelte/easing";
    import { onDestroy } from "svelte";
    import { toastTrigger } from "../../stores";

    let toast;
    let timeout;
    const unsubscribe = toastTrigger.subscribe((value) => {
        if (value == null) return;

        toast = value;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            toast = null;
        }, toast.duration);
    });
    onDestroy(unsubscribe);

    function dismiss() {
        toast = null;
    }

    const getIcon = (type) => {
        if (type === "toast-success") return "fa-circle-check";
        if (type === "toast-progress") return "fa-arrows-rotate";
        if (type === "toast-error") return "fa-circle-exclamation";
    };
</script>

{#if toast}
    <!-- svelte-ignore a11y-autofocus -->
    <div
        class="toast {toast.type} d-flex align-items-center"
        in:slide={{ easing: backOut, duration: 150 }}
        out:fade={{ duration: 150 }}
    >
        <i class="mainIcon fa-solid {getIcon(toast.type)} me-3" />
        <span class="flex-grow-1">{toast.message}</span>
        <button on:click={dismiss} class="icon-only-btn"
            ><i class="closeIcon fa-solid fa-xmark ms-2" /></button
        >
    </div>
{/if}

<style>
    div.toast {
        position: fixed;
        top: 20px;
        right: 20px;
        left: auto;
        border-radius: 8px;
        width: auto;
        height: auto;
        max-width: 40vw;
        padding: 12px 22px 15px 20px;
        font-weight: bold;
        font-size: 0.9rem;
        line-height: 1.1rem;
        border-width: 0;
    }
    i.mainIcon {
        font-size: 1.2rem;
    }
    i.closeIcon {
        font-size: 1.1rem;
    }
    div.toast-success {
        background: rgb(84, 201, 120);
        background: linear-gradient(
            150deg,
            rgba(84, 201, 120, 1) 0%,
            rgb(33, 168, 132) 100%
        );
    }
    div.toast-progress {
        background: rgb(11, 195, 215);
        background: linear-gradient(
            150deg,
            rgba(11, 195, 215, 1) 0%,
            rgba(11, 94, 215, 1) 100%
        );
    }
    div.toast-error {
        background: rgb(217, 70, 70);
        background: linear-gradient(
            150deg,
            rgba(217, 70, 70, 1) 0%,
            rgba(168, 33, 87, 1) 100%
        );
    }
</style>
