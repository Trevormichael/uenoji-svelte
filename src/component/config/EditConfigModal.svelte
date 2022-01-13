<script>
    import Modal from "../Modal.svelte";
    import pluginsystem from "../../plugin/pluginsystem";

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
    <h6>{plugin.name} Configuration</h6>
    <form
        on:submit|preventDefault={onSubmit}
        id="configForm"
        class="flex-grow-1"
    >
        <textarea
            bind:value={configValue}
            class="form-control"
            type="text"
            placeholder="JSON Configuration"
            rows="12"
        />
    </form>
    <div class="d-flex flex-grow-1 justify-content-end">
        <button
            class="btn btn-secondary me-2"
            on:click={() => {
                modal.close();
            }}>Cancel</button
        >
        <button form="configForm" class="btn btn-primary"
            ><i class="fa-solid fa-floppy-disk me-2" />Save</button
        >
    </div>
</Modal>

<style>
    button {
        float: right;
    }
    textarea {
        font-family: monospace;
    }
</style>
