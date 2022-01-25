<script>
    import { searchTerm } from "./searcher";
    import { groupBy } from "../../scripts/common";
    import { searchResults } from "../../stores";
    import TermItem from "./TermItem.svelte";
    import ps from "../../plugin/pluginsystem"

    export let term;
    let searchResultsCache = {};
    let searchResultHeadingGroups;
    let headings;

    async function search(term) {
        if (!searchResultsCache.hasOwnProperty(term)) {
            searchResultsCache[term] = [];
            let res = await searchTerm(term);
            Array.prototype.push.apply(searchResultsCache[term], res);
        }
        searchResults.set(searchResultsCache[term]);
        ps.dispatchEvent("searchResultsLoaded")
    }

    $: if (term != null) search(term);
    $: {
        searchResultHeadingGroups = groupBy($searchResults, (r) => r.heading);
        headings = Object.keys(searchResultHeadingGroups);
    }
</script>

<ul class="flex-grow-1">
    {#each headings as heading}
        <li class="termSectionHeader mx-2 my-2">
            <div class="d-flex align-items-center">
                <h5 class="sectionHeader">{heading}</h5>
                <hr class="flex-grow-1 mx-3" />
            </div>
        </li>
        {#each searchResultHeadingGroups[heading] as tr}
            <TermItem term={tr} on:export/>
        {/each}
    {/each}
</ul>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: auto;
    }
    hr {
        color: #ffffff90;
        height: 2px;
    }
    .sectionHeader {
        text-align: center;
        align-items: center;
        justify-content: center;
        margin: 0;
    }
</style>
