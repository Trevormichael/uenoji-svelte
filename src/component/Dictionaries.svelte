<script>
    import { onMount } from "svelte";
    import db from "../data/db";
    import DictionaryImport from "./dict/DictionaryImport.svelte";
    import DictionaryList from "./dict/DictionaryList.svelte";

    let dicts = [];

    async function loadDicts() {
        dicts = await db.dicts.toArray();
    }

    onMount(() => {
        loadDicts();
    });
</script>

<div class="d-flex flex-column">
    <DictionaryImport onImport={() => { loadDicts() }}/>
    <DictionaryList {dicts}/>
</div>
