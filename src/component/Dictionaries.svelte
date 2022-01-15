<script>
    import { onMount } from "svelte";
    import db from "../data/db";
    import DictionaryImport from "./dict/DictionaryImport.svelte";
    import DictionaryList from "./dict/DictionaryList.svelte";

    let dicts = [];

    async function loadDicts() {
        dicts = (await db.dicts.toArray()).sort((a, b) => a.order > b.order ? 1 : -1);
    }

    async function updateSort(dict, adj) {
        let current = dict.order;
        let newOrder = dict.order + adj
        let max = dicts.length - 1;
        if (newOrder < 0 || newOrder > max) return;
        await db.dicts.where("order").equals(newOrder).modify({ order: current });
        await db.dicts.update(dict.id, { order: newOrder });
        await loadDicts();
    }

    const sortUp = (event) => updateSort(event.detail, -1);
    const sortDown = (event) => updateSort(event.detail, 1);

    onMount(() => {
        loadDicts();
    });

</script>

<div class="d-flex flex-column">
    <DictionaryImport onImport={() => { loadDicts() }}/>
    <DictionaryList {dicts} on:sortup={sortUp} on:sortdown={sortDown}/>
</div>
