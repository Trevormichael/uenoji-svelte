<script>
    import Modal from "../Modal.svelte";
    import CancelSaveFooter from "./CancelSaveFooter.svelte";
    import pluginsystem from "../../plugin/pluginsystem";
    import { allowTab } from "../actions";

    let modal;
    let configValue;
    let plugin;

    export const open = (p) => {
        modal.open();
        plugin = p;
        let config = JSON.stringify(plugin.config, null, 1);
        configValue = config;
    };

    async function onSubmit() {
        try {
            let newConfig = JSON.parse(configValue);
            await pluginsystem.updateConfig(plugin, newConfig);
            modal.close();
        } catch (error) {
            console.log(error);
        }
    }
</script>

<Modal bind:this={modal} contentStyle={"width: 80%; height: auto;"} on:close>
    <h6>{plugin.manifest.name} Configuration</h6>
    <form
        on:submit|preventDefault={onSubmit}
        id="configForm"
        class="flex-grow-1"
    >
        <textarea
            bind:value={configValue}
            use:allowTab
            class="form-control"
            type="text"
            placeholder="JSON Configuration"
            rows="12"
        />
    </form>
    <CancelSaveFooter on:cancel={() => { modal.close(); }} form={"configForm"}/>
</Modal>

<style>
    textarea {
        font-family: monospace;
    }
</style>
