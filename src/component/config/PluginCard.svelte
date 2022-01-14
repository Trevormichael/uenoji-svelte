<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import ConfigCard from "./ConfigCard.svelte";

    export let plugin;

    const buttons = [
        {
            icon: "fa-solid fa-gears",
            action: () => dispatch("configure", plugin),
        },
        {
            icon: "fa-solid fa-trash",
            action: () => dispatch("delete", plugin),
        },
    ];
</script>

<ConfigCard {buttons}>
    <span class="pluginName me-2">{plugin.manifest.name}</span>
    <span class="pluginVersion">{plugin.manifest.version}</span>
    <span class="pluginVersion">{plugin.manifest.description ?? ""}</span>
</ConfigCard>

<style>
    .pluginName {
        font-size: 1.3rem;
    }

    .pluginVersion {
        font-size: 0.7rem;
        color: #ffffffcc;
    }
</style>