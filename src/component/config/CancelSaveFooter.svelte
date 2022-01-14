<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let form;
</script>

<div class="d-flex flex-grow-1 justify-content-end">
    <button class="btn btn-secondary me-2" on:click={() => dispatch("cancel")}
        >Cancel</button
    >
    <button {form} class="btn btn-primary" on:click={() => dispatch("save")}
        ><i class="fa-solid fa-floppy-disk me-2" />Save</button
    >
</div>

<style>
    button {
        float: right;
    }
</style>
