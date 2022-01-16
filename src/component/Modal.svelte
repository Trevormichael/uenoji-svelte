<script>
    import { scale, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";

    export let contentStyle = "";

    const dispatch = createEventDispatcher();

    function onClickOutside() {
        dispatch("clickoutside");
    }
</script>

<!-- svelte-ignore a11y-autofocus -->
<div class="modal" tabindex={0} autofocus>
    <div in:fade={{ duration: 100 }} class="backdrop" on:click={onClickOutside} />

    <div
        in:scale={{ easing: quintOut, duration: 500 }}
        class="content container-fluid"
        style={contentStyle}
    >
        <slot />
    </div>
</div>

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
