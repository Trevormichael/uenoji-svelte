<script>
    import { searchTerm as term } from "../stores";
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
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
    
    const dispatch = createEventDispatcher();

    export let note;
    export let onExport;

    let noteInfo;
    let noteFields;
    let hasChanges;

    //bindings
    let searchValue;

    $: searchTerm(ankinote.getFieldValue(note, "Vocab"));

    function searchTerm(t) {
        if (t != null && t.length > 0) term.set(t);
    }

    const searchTermFromSearchInput = () => {
        searchTerm(searchValue);
        searchValue = "";
    };

    const searchSelectionText = () => searchTerm(getSelectionText().trim());

    const getNoteWithChanges = () => {
        let n = note;
        (noteFields || []).forEach(f => {
            if (f.changed)
                n.fields[f.key].value = f.value;
        });
        return n;
    };

    const addTermToNote = async (event) => {
        let term = event.detail.term;
        let selection = event.detail.selection;
        let changes = await termexporter.mapTermToFieldChanges(
            term,
            selection,
            getNoteWithChanges()
        );
        noteInfo.applyChanges(changes);
    };  

    const exportChanges = async () => {
        let id = note.noteId;
        let changes = noteInfo.getChanges();
        await anki.updateNoteFields(id, changes);
        onExport();
    };

    const onFieldChange = (event) => {
        hasChanges = event.detail.hasChanges;
    }

    const dispatchCancel = () => dispatch("cancel");

    onMount(() => {
        ps.dispatchEvent("noteLoaded")
        Mousetrap.bind("command+f", searchSelectionText);
    });
    onDestroy(() => {
        term.set(null);
        Mousetrap.unbind("command+f");
    });
</script>

<Modal on:clickoutside={dispatchCancel}>
    <div class="ankiModalContent d-flex flex-column">
        <div class="flex-shrink-1">
            <form
                on:submit|preventDefault={searchTermFromSearchInput}
                class="mt-2"
            >
                <input
                    bind:value={searchValue}
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
                <AnkiNoteInfo
                    bind:this={noteInfo}
                    bind:fields={noteFields}
                    on:fieldchange={onFieldChange}
                    note={note}
                />
            </div>
        </div>
        <div class="d-flex flex-shrink-1 mt-2">
            <button
                on:click={noteInfo.clearChanges}
                class="btn btn-danger"
                ><i class="fa-solid fa-arrow-rotate-left me-2" />Clear all
                changes</button
            >
            <div class="d-flex flex-grow-1 justify-content-end">
                <button
                    class="btn btn-secondary me-2"
                    on:click={dispatchCancel}>Cancel</button
                >
                <button
                    disabled={!hasChanges}
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
