<script>
    import { onMount } from "svelte";
    import ConfigEntityHeader from "./config/ConfigEntityHeader.svelte";
    import EditConfigModal from "./config/EditConfigModal.svelte";
    import NewPluginModal from "./config/NewPluginModal.svelte";
    import PluginList from "./config/PluginList.svelte";
    import pluginsystem from "../plugin/pluginsystem";

    let plugins = [];
    let fieldMappings = [];

    async function refreshPluginList() {
        pluginsystem.reloadPlugins();
        plugins = pluginsystem.getLoadedPlugins();
    }

    async function removePlugin(plugin) {
        pluginsystem.deletePlugin(plugin);
        refreshPluginList();
    }

    onMount(() => {
        plugins = pluginsystem.getLoadedPlugins();
    });

    let newPluginModal;
    let editConfigModal;
</script>

<div class="p-3">
    <ConfigEntityHeader
        title={"Field Mappings"}
        count={fieldMappings.length}
        buttonText={"Add Field Mapping"}
    />
    <ConfigEntityHeader
        title={"Plugins"}
        count={plugins.length}
        buttonText={"Add Plugin"}
        on:click={() => {
            window.plugins.openDirectory();
        }}
    />
    <PluginList
        {plugins}
        onConfigureClick={plugin => {
            editConfigModal.open(plugin);
        }}
        onRemoveClick={removePlugin}
    />
</div>
<NewPluginModal bind:this={newPluginModal} on:close={refreshPluginList} />
<EditConfigModal bind:this={editConfigModal} on:close={refreshPluginList} />
