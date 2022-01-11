<script>
    export let note;

    function getFields(n) {
        if (n == null) return [];

        let fields = n.fields;
        return Object.keys(fields).map((key) => {
            return { key: key, value: fields[key].value };
        });
    }

    $: fields = getFields(note);
</script>

<ul class="flex-grow-1">
    {#each fields as field}
        <li class="py-1 px-2 mb-1">
            <div class="label">{field.key}</div>
            <div class="value">{@html field.value}</div>
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: auto;
    }

    li {
        background-color: var(--card-color);
        border-radius: 5px;
    }

    .label {
        font-size: 0.8rem;
        color: #ffffffcc;
    }

    .value {
        font-size: 1.2rem;
        list-style-type: initial;
        list-style-position: inside;
    }
</style>
