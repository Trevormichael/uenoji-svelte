<script>
    import Modal from "./Modal.svelte";
    import AnkiNoteInfo from "./anki/AnkiNoteInfo.svelte";
    import DictionarySearch from "./dict/DictionarySearch.svelte";
    import anki from "../scripts/anki-connect";

    let note = null;

    let modal;

    export const open = async (noteId) => {
        modal.open();
        note = await anki.noteInfo(noteId);
    };

    export const close = () => modal.close();
</script>

<Modal bind:this={modal}>
    <div class="ankiModalContent d-flex flex-column">
        <div class="flex-shrink-1">
            <form id="dict-search-form" class="mt-2">
                <input
                    id="dict-search-term"
                    class="form-control"
                    type="text"
                    placeholder="Search..."
                    aria-label="Search"
                />
            </form>
        </div>
        <div class="d-flex flex-row flex-grow-1 mainContent">
            <div class="d-flex flex-even me-1">
                <DictionarySearch term={"感性"} />
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
