<script>
    import { onMount } from "svelte";
    import ConfigEntityHeader from "./config/ConfigEntityHeader.svelte";
    import NewPluginModal from "./config/NewPluginModal.svelte";
    import PluginList from "./config/PluginList.svelte";
    import pluginsystem from "../plugin/pluginsystem";

    let plugins = [];

    async function refreshPluginList() {
        plugins = await pluginsystem.listPlugins();
    }

    onMount(refreshPluginList);

    $: console.log(plugins);

    let newPluginModal;
</script>

<div class="p-3">
    <ConfigEntityHeader
        title={"Field Mappings"}
        buttonText={"Add Field Mapping"}
    />
    <ConfigEntityHeader
        title={"Plugins"}
        count={plugins.length}
        buttonText={"Add Plugin"}
        on:click={() => {
            newPluginModal.open();
        }}
    />
    <PluginList {plugins}/>
</div>
<NewPluginModal bind:this={newPluginModal} on:close={refreshPluginList} />
