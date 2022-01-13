<script>
    import Modal from "../Modal.svelte";
    import pluginsystem from "../../plugin/pluginsystem";

    let modal;
    let fileInput;

    export const open = () => {
        modal.open();
    };

    async function onSubmit() {
        let file = fileInput.files[0];
        if (file != null) {
            await pluginsystem.addPluginPackage(file);
            modal.close();
        }
    }
</script>

<Modal bind:this={modal} contentStyle={"width: auto; height: auto;"} on:close>
    <div class="py-2">Select the plugin zip file.</div>
    <form on:submit|preventDefault={onSubmit} id="pluginForm" class="flex-grow-1">
        <input bind:this={fileInput} class="form-control" type="file" accept=".zip" />
    </form>
    <button form="pluginForm" class="btn btn-primary"
        ><i class="fa-solid fa-floppy-disk me-2" />Save</button
    >
</Modal>

<style>
    button {
        float: right;
    }
</style>
