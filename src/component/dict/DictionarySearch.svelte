<script>
    import { searchTerm } from "./searcher";

    export let term;
    let termResult = [];
    let results = {};

    async function search(term) {
        if (!results.hasOwnProperty(term)) {
            results[term] = [];
            await searchTerm(term, (res) => {
                Array.prototype.push.apply(results[term], res);
                termResult = results[term];
            });
        }
    }

    function clearAllResults() {
        results = {};
    }

    $: if (term != null) search(term);
</script>

<ul class="flex-grow-1">
    {#each termResult as tr}
        <li class="pt-1 pb-2 px-2 mb-1">
            <div class="d-flex">
                <div class="flex-grow-1 align-baseline">
                    <span class="align-baseline main">{tr.term}</span>
                    <span class="align-baseline reading">{tr.reading}</span>
                    <div class="align-baseline def">{tr.defString}</div>
                    <div class="align-baseline dict mt-1">{tr.dictName}</div>
                </div>
                <div class="flex-shrink-1 d-flex align-items-end">
                    <button class="btn btn-primary float-end export-def me-1 mb-2"
                        ><i class="fa-solid fa-plus" />
                    </button>
                </div>
            </div>
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: auto;
    }
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
