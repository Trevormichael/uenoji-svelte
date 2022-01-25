<script>
    import { onMount, onDestroy } from "svelte";
    import db from "../../data/db";
    import Mousetrap from "../../lib/mousetrap.min.js";

    export let onQuery;
    export let query;

    let queryInput;

    async function runQuery() {
        queryInput.blur();
        await db.prefs.put({ key: "latestQuery", value: query });
        onQuery();
    }

    async function loadLastQuery() {
        let latestQuery = await db.prefs.get("latestQuery");
        if (latestQuery != null) 
            query = latestQuery.value;
    }

    onMount(() => {
        loadLastQuery();
        Mousetrap.bind("command+e", runQuery);
    });
    onDestroy(() => {
        Mousetrap.unbind("command+e");
    })
</script>

<div class="d-flex">
    <form
        on:submit|preventDefault={runQuery}
        id="query-form"
        class="flex-grow-1 d-flex"
    >
        <!-- svelte-ignore a11y-autofocus -->
        <input
            bind:this={queryInput}
            bind:value={query}
            spellcheck="false"
            class="form-control flex-grow-1"
            type="text"
            placeholder="Enter Search Query"
            aria-label="Enter Search Query"
            autofocus
        />
    </form>
    <button
        id="execute-query"
        form="query-form"
        type="submit"
        class="btn btn-primary ms-2 flex-shrink-1"
        ><i class="fa-solid fa-magnifying-glass me-2" />Search</button
    >
</div>
