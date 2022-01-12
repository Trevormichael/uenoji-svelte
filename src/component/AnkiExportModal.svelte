<script>
    import Modal from "./Modal.svelte";
    import AnkiNoteInfo from "./anki/AnkiNoteInfo.svelte";
    import DictionarySearch from "./dict/DictionarySearch.svelte";
    import SearchHistory from "./dict/SearchHistory.svelte";
    import anki from "../scripts/anki-connect";
    import ankinote from "./anki/ankinote";
    import Mousetrap from "../lib/mousetrap.min.js";
    import { getSelectionText } from "../scripts/common";

    let note = null;
    let pendingChanges = {};
    let term;

    //bindings
    let searchInput;
    let modal;

    $: searchTerm(ankinote.getFieldValue(note, "Vocab"));

    function searchTerm(t) {
        if (t != null && t.length > 0) term = t;
    }

    const searchTermFromSearchInput = () => {
        searchTerm(searchInput.value);
        searchInput.value = "";
    };
    const searchSelectionText = () => searchTerm(getSelectionText().trim());

    export const open = async (noteId) => {
        modal.open();
        note = await anki.noteInfo(noteId);
        Mousetrap.bind("command+f", searchSelectionText);
    };

    const onClose = () => {
        note = null;
        pendingChanges = {};
        term = null;
        Mousetrap.unbind("command+f");
    };
</script>

<Modal bind:this={modal} on:close={onClose}>
    <div class="ankiModalContent d-flex flex-column">
        <div class="flex-shrink-1">
            <form
                on:submit|preventDefault={searchTermFromSearchInput}
                class="mt-2"
            >
                <input
                    bind:this={searchInput}
                    class="form-control"
                    type="text"
                    placeholder="Search..."
                    aria-label="Search"
                />
            </form>
        </div>
        <div class="flex-shrink-1 pb-2 searchHistory">
            <SearchHistory
                {term}
                on:select={(event) => searchTerm(event.detail.name)}
            />
        </div>
        <div class="d-flex flex-row flex-grow-1 mainContent">
            <div class="d-flex flex-even me-1">
                <DictionarySearch {term} />
            </div>
            <div class="d-flex flex-even ms-1">
                <AnkiNoteInfo {note} />
            </div>
        </div>
        <div class="d-flex flex-shrink-1 mt-2">
            <button class="btn btn-danger">Clear all changes</button>
            <div class="d-flex flex-grow-1 justify-content-end">
                <button
                    class="btn btn-secondary me-2"
                    on:click={() => {
                        modal.close();
                    }}>Cancel</button
                >
                <button class="btn btn-primary">Export changes</button>
            </div>
        </div>
    </div>
</Modal>

<style>
    .ankiModalContent {
        width: 100%;
        height: 100%;
    }
    .mainContent {
        min-height: 0;
    }
</style>
