<script>
    export let items = [];
</script>

<ul class="mb-3">
    {#each items as item}
        <li class="mb-1">
            <slot {item} />
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
</style>
