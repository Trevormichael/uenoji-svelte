<script>
    import "@fortawesome/fontawesome-free/css/all.min.css";

    export let dicts = [];
</script>

<ul>
    {#each dicts as dict}
        <li class="mx-2 mb-1 p-3">{dict.name}</li>
    {/each}
</ul>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    li {
        background-color: var(--card-color);
        border-radius: 10px;
    }
</style>