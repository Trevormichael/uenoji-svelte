<script>
    import importer from "./dictionaryimporter";
    import { show } from "../toast/toast";

    export let onImport;

    let fileInput;

    async function onSubmit(e) {
        console.log(fileInput.files)
        let file = fileInput.files[0];
        if (file != null) {
            await importer.importDictionary(file, onProgress, onError)
            onImport();
        }
    }

    function onProgress(perc) {
        let rounded = Math.round(perc * 100);
        if (rounded >= 100)
            show("Dictionary import complete.", "success", 5000);
        else
            show(`Import in progress... ${rounded}%`, "progress", 10000);
    }

    function onError(msg) {
        show(msg, "error", 5000);
    }

</script>

<div class="d-flex flex-column p-2">
    <h6>Add Dictionary</h6>
    <div class="d-flex">
        <form on:submit|preventDefault={onSubmit} id="dictForm" class="flex-grow-1">
            <input
                bind:this={fileInput} 
                class="form-control"
                type="file"
                accept=".zip"
            />
        </form>
        <button form="dictForm" class="btn btn-primary ms-2"><i class="fa-solid fa-floppy-disk me-2"></i>Save</button>
    </div>
</div>