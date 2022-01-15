<script>
    import { selectedNote } from "../stores";
    import AnkiConnectBadge from "./anki/AnkiConnectBadge.svelte";
    import AnkiQueryForm from "./anki/AnkiQueryForm.svelte";
    import AnkiNoteListItem from "./anki/AnkiNoteListItem.svelte";
    import anki from "../scripts/anki-connect";
    import AnkiExportModal from "./AnkiExportModal.svelte";
    import { show } from "./toast/toast";

    let notes = [];

    async function performQuery(query) {
        notes = await anki.queryNotes(query);
        if (notes.length == 1) {
            selectedNote.set(notes[0]);
        }
    }

    async function onNoteSelect(event) {
        let note = await anki.noteInfo(event.detail.noteId);
        selectedNote.set(note);
    }

    function onExport() {
        selectedNote.set(null);
        show("Note exported successfully", "success", 4000)
    }
</script>

<div class="px-2 pt-2">
    <AnkiConnectBadge />
</div>
<div class="row flex-shrink-1 px-2">
    <div class="col-12">
        <AnkiQueryForm onQuery={performQuery} />
    </div>
</div>
<div class="d-flex flex-shrink-1 py-1 p-2 mx-2 mt-1" id="resultCount">
    <span>{notes.length} result{notes.length == 1 ? "" : "s"} found.</span>
</div>
<div class="d-flex flex-grow-1 pt-2 me-2 overflow-auto">
    <ul class="flex-grow-1">
        {#each notes as note}
            <AnkiNoteListItem
                {note}
                on:select={onNoteSelect}
                active={$selectedNote && $selectedNote.noteId === note.noteId}
            />
        {/each}
    </ul>
</div>

{#if $selectedNote}
<AnkiExportModal
    note={$selectedNote}
    onExport={onExport}
    on:cancel={() => { selectedNote.set(null); }}
/>
{/if}

<style>
    #resultCount {
        background-color: #ffffff11;
        border-radius: 5px;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: auto;
    }
</style>
