<script>
    import { slide } from "svelte/transition";

    let isOpen = false;

    export function open() {
        isOpen = true;
    }

    export function close() {
        isOpen = false;
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y-autofocus -->
    <div class="modal" tabindex={0} autofocus>
        <div class="backdrop" on:click={close} />

        <div in:slide={{ duration: 200 }} class="content container-fluid">
            <slot />
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
    }
    div.backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }
    div.content {
        z-index: 10;
        border-radius: 10px;
        background-color: #2c2d37;
        overflow: hidden;
        height: 100%;
        padding: 10px 18px 10px 18px;
    }
</style>
