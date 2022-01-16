<script>
    import { scale, fade } from "svelte/transition";
    import { backOut } from "svelte/easing";
    import { onDestroy } from "svelte";
    import { confirmationTrigger } from "../../stores";

    let data;

    const unsubscribe = confirmationTrigger.subscribe((value) => {
        if (value == null) return;
        data = value;
    });

    onDestroy(unsubscribe);

    function confirm() {
        if (data.onConfirm) data.onConfirm();
        data = null;
    }

    function cancel() {
        if (data.onCancel) data.onCancel();
        data = null;
    }
</script>

{#if data}
    <!-- svelte-ignore a11y-autofocus -->
    <div class="modal">
        <div in:fade={{ duration: 100 }} class="backdrop" />

        <div
            in:scale={{ easing: backOut, duration: 300 }}
            class="content d-flex flex-column"
        >
            <div class="message px-2 py-4">{data.message}</div>
            <div class="flex-shrink-1 d-flex">
                <button
                    on:click={cancel}
                    class="btn btn-secondary flex-even me-1">Cancel</button
                >
                <button
                    on:click={confirm}
                    class="btn btn-primary flex-even ms-1"
                    >{data.confirmText}</button
                >
            </div>
        </div>
    </div>
{/if}

<style>
    div.modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        padding: 30px;

        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
    }
    div.backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
    }
    div.content {
        z-index: 10;
        border-radius: 10px;
        background-color: var(--card-color);
        overflow: hidden;
        padding: 10px 18px 10px 18px;
    }
    div.message {
        font-size: 1.2rem;
    }
</style>
