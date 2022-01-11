<script>
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export var options = []
    export var selected = 0

    function select(op) {
        dispatch('select', op)
    }
</script>

<ul class="nav nav-pills">
    {#each options as op}
        <li class="nav-item">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="nav-link" class:active = {op == selected} 
            on:click={() => select(op)}>{op.name}</a>
        </li>
    {/each}
</ul>

<style>
    a.nav-link {
        cursor: pointer;
    }
</style>