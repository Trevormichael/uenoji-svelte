<script>
    import { note, searchTerm as term } from "../stores";
    import { get } from "svelte/store";
    import Modal from "./Modal.svelte";
    import AnkiNoteInfo from "./anki/AnkiNoteInfo.svelte";
    import TermList from "./dict/TermList.svelte";
    import SearchHistory from "./dict/SearchHistory.svelte";
    import termexporter from "./dict/termexporter";
    import anki from "../scripts/anki-connect";
    import ankinote from "./anki/ankinote";
    import Mousetrap from "../lib/mousetrap.min.js";
    import { getSelectionText } from "../scripts/common";
    import ps from "../plugin/pluginsystem";

    export let onExport; 

    let pendingChanges = {};

    //bindings
    let searchInput;
    let modal;

    $: searchTerm(ankinote.getFieldValue($note, "Vocab"));

    function searchTerm(t) {
        if (t != null && t.length > 0) term.set(t);
    }

    const searchTermFromSearchInput = () => {
        searchTerm(searchInput.value);
        searchInput.value = "";
    };

    const searchSelectionText = () => searchTerm(getSelectionText().trim());

    const getNoteWithChanges = () => {
        let n = get(note);
        Object.keys(pendingChanges).forEach((key) => {
            n.fields[key].value = pendingChanges[key];
        });
        return n;
    };

    const addTermToNote = async (event) => {
        let term = event.detail.term;
        let selection = event.detail.selection;
        pendingChanges = await termexporter.mapTermToFieldChanges(
            term,
            selection,
            getNoteWithChanges()
        );
    };

    const exportChanges = async () => {
        let id = get(note).noteId;
        await anki.updateNoteFields(id, pendingChanges);
        modal.close();
        onExport();
    }

    export const open = async (noteId) => {
        modal.open();
        note.set(await anki.noteInfo(noteId));
        ps.dispatchEvent("noteLoaded");
        Mousetrap.bind("command+f", searchSelectionText);
    };

    const onClose = () => {
        note.set(null);
        pendingChanges = {};
        term.set(null);
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
                term={$term}
                on:select={(event) => searchTerm(event.detail.name)}
            />
        </div>
        <div class="d-flex flex-row flex-grow-1 mainContent">
            <div class="d-flex flex-even me-1">
                <TermList term={$term} on:export={addTermToNote} />
            </div>
            <div class="d-flex flex-even ms-1">
                <AnkiNoteInfo note={$note} fieldChanges={pendingChanges} />
            </div>
        </div>
        <div class="d-flex flex-shrink-1 mt-2">
            <button
                on:click={() => {
                    pendingChanges = {};
                }}
                class="btn btn-danger"
                ><i class="fa-solid fa-arrow-rotate-left me-2" />Clear all
                changes</button
            >
            <div class="d-flex flex-grow-1 justify-content-end">
                <button
                    class="btn btn-secondary me-2"
                    on:click={() => {
                        modal.close();
                    }}>Cancel</button
                >
                <button 
                on:click={exportChanges}
                class="btn btn-primary"
                    ><i class="fa-solid fa-share me-2" />Export changes</button
                >
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
