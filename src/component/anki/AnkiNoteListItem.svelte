<script>
    export let note;
    export let active;

    function getFields(n) {
        let fields = n.fields;
        return Object.keys(fields)
            .map((key) => {
                return { key: key, value: fields[key].value };
            })
            .filter((kv) => kv.value != null && kv.value.length > 0)
            .map((kv) => `${kv.key}: ${kv.value}`)
            .join(", ");
    }

    $: fields = getFields(note);
</script>

<li class="mx-2 mb-1 {active ? "bg-primary": ""}" on:click>
    <span class="modelName pb-1">{note.modelName}</span>
    <div class="fields">{fields}</div>
    <div class="noteId pt-1">Note Id: {note.noteId}</div>
</li>

<style>
    li {
        padding: 3px 10px 10px 10px;
        background-color: var(--card-color);
        border-radius: 10px;
    }

    li > * {
        cursor: pointer;
    }

    .fields {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        line-height: 1.2em; /* Height taken by one line */
        max-height: 2.4em;
        font-size: 0.9em;
    }

    .modelName {
        font-size: 0.8em;
        color: #ffffffcc
    }

    .noteId {
        font-size: 0.7em;
        color: #ffffffcc
    }
</style>
