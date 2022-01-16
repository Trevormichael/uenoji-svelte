<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { getSelectionText } from "../../scripts/common";
    const dispatch = createEventDispatcher();

    export let term;
    let hasMapping;
    let li; 

    const modalContext = getContext('exportModal');

    const onExportClick = () => dispatch("export", {
        term: term,
        selection: getTextSelectionInChildren()
    });

    const checkForMapping = async(term) => {
        hasMapping = await modalContext.hasMapping(term.dictName);
    }

    function getTextSelectionInChildren() {
        var textHighlightNode = window.getSelection().anchorNode.parentNode
        if (textHighlightNode != null) {
            var closestLiToHighlight = textHighlightNode.closest('li')
            if (closestLiToHighlight === li) {
                return getSelectionText()
            }
        }
        return null;
    }

    $: checkForMapping(term);

</script>

<li bind:this={li} class="pt-1 pb-2 px-2 mb-1 me-2">
    <div class="d-flex">
        <div class="flex-grow-1 align-baseline">
            <span class="align-baseline main">{term.term}</span>
            <span class="align-baseline reading">{term.reading} - {term.freq}</span>
            <div class="align-baseline def">{term.defString}</div>
            <div class="align-baseline dict mt-1">{term.dictName}</div>
        </div>
        <div class="flex-shrink-1 d-flex align-items-end">
            <button disabled={!hasMapping} on:click={onExportClick} class="btn btn-primary float-end export-def me-1 mb-2"
                ><i class="fa-solid fa-arrow-right" />
            </button>
        </div>
    </div>
</li>

<style>
    li {
        background-color: var(--card-color);
        border-radius: 5px;
    }
    .main {
        font-size: 1.5rem;
    }
    .reading {
        font-size: 1.1rem;
        color: #ffffffcc;
    }
    .def {
        font-size: 1rem;
        white-space: pre-wrap;
    }
    .dict {
        font-size: 0.8rem;
        color: #ffffffaa;
    }
    .export-def {
        padding: 2px 6px 2px 6px;
    }
</style>