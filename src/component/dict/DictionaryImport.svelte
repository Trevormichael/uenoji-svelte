<script>
    import importer from './dictionaryimporter'

    export let onImport;

    let fileInput;

    async function onSubmit(e) {
        console.log(fileInput.files)
        let file = fileInput.files[0];
        if (file != null) {
            await importer.importDictionary(file, (progress) => {
                console.log(progress)
            })
            onImport();
        }
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