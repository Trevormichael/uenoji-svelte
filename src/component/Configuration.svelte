<script>
    import { onMount } from "svelte";
    import ConfigEntityHeader from "./config/ConfigEntityHeader.svelte";
    import PluginList from "./config/PluginList.svelte";
    import MappingList from "./config/MappingList.svelte";

    let mappingCount = 0;
    let pluginCount = 0;
    let mappingModal;

</script>

<div class="p-3">
    <ConfigEntityHeader
        title={"Field Mappings"}
        count={mappingCount}
        buttonText={"Add Field Mapping"}
        on:click={() =>  mappingModal.open()}
    />
    <MappingList bind:modal={mappingModal} bind:count={mappingCount}/>
    <ConfigEntityHeader
        title={"Plugins"}
        count={pluginCount}
        buttonText={"Open Plugins Folder"}
        icon={"fa-solid fa-folder-open"}
        on:click={() => {
            window.plugins.openDirectory();
        }}
    />
    <PluginList bind:count={pluginCount}/>
</div>
