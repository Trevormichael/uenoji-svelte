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
        if (type === "success") return "fa-circle-check";
        if (type === "error") return "fa-circle-exclamation";
    };
</script>

{#if toast}
    <!-- svelte-ignore a11y-autofocus -->
    <div
        class="toast {toast.type} d-flex align-items-center"
        in:slide={{ easing: backOut, duration: 150 }}
        out:fade={{ duration: 150 }}
    >
        <i class="fa-solid {getIcon(toast.type)} fa-circle-check me-3" />
        <span class="flex-grow-1">{toast.message}</span>
        <button on:click={dismiss} class="icon-only-btn"
            ><i class="fa-solid fa-xmark ms-2" /></button
        >
    </div>
{/if}

<style>
    div.toast {
        position: fixed;
        top: 20px;
        left: auto;
        right: 20px;
        border-radius: 10px;
        padding: 12px 20px 12px 20px;
        font-weight: bold;
        font-size: 1rem;
        line-height: 1rem;
    }
    div.toast.success {
        background: rgb(84, 201, 120);
        background: linear-gradient(
            150deg,
            rgba(84, 201, 120, 1) 0%,
            rgb(33, 168, 132) 100%
        );
    }
    div.toast.error {
        background: rgb(217, 70, 70);
        background: linear-gradient(
            150deg,
            rgba(217, 70, 70, 1) 0%,
            rgba(168, 33, 87, 1) 100%
        );
    }
</style>
