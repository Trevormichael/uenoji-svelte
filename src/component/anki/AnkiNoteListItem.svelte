<script>

    export let note;

    $: {
        console.log(note)
    }

</script>

<li class="mx-2 mb-1 p-2">
    <span>{note.modelName}</span>
    <div>{note.noteId}</div>
</li>

<style>
    li {
        background-color: var(--card-color);
        border-radius: 10px;
    }
</style>