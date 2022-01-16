<script>
    import { onMount } from "svelte";
    import ConfigList from "./ConfigList.svelte";
    import PluginCard from "./PluginCard.svelte";
    import EditConfigModal from "./EditConfigModal.svelte";
    import pluginsystem from "../../plugin/pluginsystem";
    import { show } from "../toast/toast";
    import { confirm } from "../modal/confirmation";

    let plugins = [];
    let selectedPlugin;
    export let count;

    $: count = plugins.length;

    async function updatePluginList() {
        pluginsystem.reloadPlugins();
        plugins = pluginsystem.getLoadedPlugins();
    }

    async function removePlugin(event) {
        confirm(
            "Are you sure you want to delete this plugin?",
            "Delete",
            () => {
                pluginsystem.deletePlugin(event.detail);
                updatePluginList();
            }
        );
    }

    const configurePlugin = (event) => {
        selectedPlugin = event.detail;
    };
    const onEditConfigCancel = () => {
        selectedPlugin = null;
    };
    const onEditConfigSuccess = () => {
        selectedPlugin = null;
        show("Plugin config updated.", "success", 3000);
        updatePluginList();
    };

    onMount(() => {
        plugins = pluginsystem.getLoadedPlugins();
    });
</script>

<ConfigList items={plugins} let:item={i}>
    <PluginCard
        plugin={i}
        on:configure={configurePlugin}
        on:delete={removePlugin}
    />
</ConfigList>
{#if selectedPlugin}
    <EditConfigModal
        plugin={selectedPlugin}
        on:cancel={onEditConfigCancel}
        on:editsuccess={onEditConfigSuccess}
    />
{/if}
