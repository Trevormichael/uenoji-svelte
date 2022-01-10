<script>
    import { onMount } from "svelte";
    import AnkiConnectBadge from "./anki/AnkiConnectBadge.svelte";
    import AnkiQueryForm from "./anki/AnkiQueryForm.svelte";
    import AnkiNoteListItem from "./anki/AnkiNoteListItem.svelte";
    import anki from "../scripts/anki-connect";

    let notes = [];

    async function performQuery(query) {
        notes = await anki.queryNotes(query);
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
<div class="d-flex flex-shrink-1 py-1 p-2 mx-2" id="result-count">
    <span id="res-count">0 results found.</span>
</div>
<div class="d-flex flex-grow-1 pt-2 test">
    <ul class="flex-grow-1" id="query-results">
        {#each notes as note}
            <AnkiNoteListItem {note} />
        {/each}
    </ul>
</div>

<style>
    .test {
        overflow: auto;
    }

    #result-count {
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
