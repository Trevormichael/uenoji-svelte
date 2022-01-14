<script>
    export let plugins = [];

    export let onConfigureClick;
    export let onRemoveClick;
</script>

<ul>
    {#each plugins as plugin}
        <li class="mb-1 p-3">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1 mx-2">
                    <span class="pluginName me-2">{plugin.manifest.name}</span>
                    <span class="pluginVersion">{plugin.manifest.version}</span>
                    <span class="pluginVersion">{plugin.manifest.description ?? ""}</span>
                </div>
                <button on:click={() => { onConfigureClick(plugin); }} class="icon-only-btn icon-btn"
                    ><span>
                        <i class="fa-solid fa-gears" />
                    </span></button
                >
                <button on:click={() => { onRemoveClick(plugin); }} class="icon-only-btn"
                    ><span>
                        <i class="fa-solid fa-trash" />
                    </span></button
                >
            </div>
        </li>
    {/each}
</ul>

<style>
    .pluginName {
        font-size: 1.3rem;
    }

    .pluginVersion {
        font-size: 0.7rem;
        color: #ffffffcc;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    li {
        background-color: var(--card-color);
        border-radius: 10px;
    }
</style>
