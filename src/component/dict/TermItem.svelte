<script>
    export let term;
    export let onExport;

    function onExportClick() {
        onExport(term);
    }
</script>

<li class="pt-1 pb-2 px-2 mb-1 me-2">
    <div class="d-flex">
        <div class="flex-grow-1 align-baseline">
            <span class="align-baseline main">{term.term}</span>
            <span class="align-baseline reading">{term.reading}</span>
            <div class="align-baseline def">{term.defString}</div>
            <div class="align-baseline dict mt-1">{term.dictName}</div>
        </div>
        <div class="flex-shrink-1 d-flex align-items-end">
            <button on:click={onExportClick} class="btn btn-primary float-end export-def me-1 mb-2"
                ><i class="fa-solid fa-plus" />
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