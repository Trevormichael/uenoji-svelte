<script>
    export let buttons = [];
</script>

<div class="configCard d-flex align-items-center p-3">
    <div class="flex-grow-1 mx-2">
        <slot />
    </div>
    {#each buttons as button}
        <button disabled={button.disabled || null} on:click={button.action} class="icon-only-btn"
            ><span>
                <i class={button.icon} />
            </span></button
        >
    {/each}
</div>

<style>
    .configCard {
        background-color: var(--card-color);
        border-radius: 10px;
    }
    button:disabled {
        opacity: 0.3;
    }
</style>
