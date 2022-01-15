<script>
    import { onMount, createEventDispatcher } from "svelte";
    import Modal from "../Modal.svelte";
    import CancelSaveFooter from "./CancelSaveFooter.svelte";
    import pluginsystem from "../../plugin/pluginsystem";
    import { allowTab } from "../actions";
    import { show } from "../toast/toast";
    const dispatch = createEventDispatcher();

    export let plugin;
    let configValue;

    const dispatchEditSuccess = () => dispatch("editsuccess")
    const dispatchCancel = () => dispatch("cancel");

    async function onSubmit() {
        try {
            let newConfig = JSON.parse(configValue);
            await pluginsystem.updateConfig(plugin, newConfig);
            dispatchEditSuccess();
        } catch (error) {
            show(error, "error", 5000);
            console.log(error);
            dispatchCancel();
        }
    }

    onMount(() => {
        configValue = JSON.stringify(plugin.config, null, 1);
    });
</script>

<Modal contentStyle={"width: 80%; height: auto;"} on:clickoutside={dispatchCancel}>
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
    <CancelSaveFooter on:cancel={dispatchCancel} form={"configForm"}/>
</Modal>

<style>
    textarea {
        font-family: monospace;
    }
</style>
