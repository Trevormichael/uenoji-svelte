<script>
    import { onMount } from "svelte";
    import ConfigList from "./ConfigList.svelte";
    import PluginCard from "./PluginCard.svelte";
    import EditConfigModal from "./EditConfigModal.svelte";
    import db from "../../data/db";
    import pluginsystem from "../../plugin/pluginsystem";

    let plugins = [];
    let modal;
    export let count;

    $: count = plugins.length;

    async function updatePluginList() {
        pluginsystem.reloadPlugins();
        plugins = pluginsystem.getLoadedPlugins();
    }

    async function removePlugin(event) {
        pluginsystem.deletePlugin(event.detail);
        updatePluginList();
    }

    const configurePlugin = (event) => modal.open(event.detail);

    onMount(() => {
        plugins = pluginsystem.getLoadedPlugins();
    });
</script>

<ConfigList items={plugins} let:item={i}>
    <PluginCard plugin={i} on:configure={configurePlugin} on:delete={removePlugin}/>
</ConfigList>
<EditConfigModal bind:this={modal} on:close={updatePluginList} />
