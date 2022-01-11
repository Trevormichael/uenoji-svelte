<script>
    import { onMount } from "svelte";
    import db from "../../data/db";

    export let onQuery;

    let queryInput;
    let hidePrevExports = false;

    async function runQuery() {
        let query = queryInput.value;
        queryInput.blur();
        await db.prefs.put({ key: "latestQuery", value: query });
        await db.prefs.put({ key: "hidePrevExports", value: hidePrevExports });
        onQuery(query);
    }

    async function loadLastQuery() {
        let query = await db.prefs.get("latestQuery");
        let hidePrev = await db.prefs.get("hidePrevExports");
        if (query != null) queryInput.value = query.value;
        if (hidePrev != null) hidePrevExports = hidePrev.value;
    }

    onMount(() => {
        loadLastQuery();
    });
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
<div class="d-flex">
    <div class="form-check form-switch">
        <input
            bind:checked={hidePrevExports}
            class="form-check-input"
            type="checkbox"
            id="hidePrevExports"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault">
            Hide previously exported notes
        </label>
    </div>
</div>
