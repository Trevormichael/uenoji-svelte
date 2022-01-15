<script>
    import ConfigEntityHeader from "./config/ConfigEntityHeader.svelte";
    import PluginList from "./config/PluginList.svelte";
    import MappingList from "./config/MappingList.svelte";

    // bound
    let startNewMapping;
    let mappingCount = 0;
    let pluginCount = 0;

    const openPluginDir = () => window.plugins.openDirectory();
</script>

<div class="p-3">
    <ConfigEntityHeader
        title={"Field Mappings"}
        count={mappingCount}
        buttonText={"Add Field Mapping"}
        on:click={startNewMapping}
    />
    <MappingList bind:startNewMapping={startNewMapping} bind:count={mappingCount}/>
    <ConfigEntityHeader
        title={"Plugins"}
        count={pluginCount}
        buttonText={"Open Plugins Folder"}
        icon={"fa-solid fa-folder-open"}
        on:click={openPluginDir}
    />
    <PluginList bind:count={pluginCount}/>
</div>
