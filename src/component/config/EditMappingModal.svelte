<script>
    import { createEventDispatcher } from "svelte";
    import Modal from "../Modal.svelte";
    import CancelSaveFooter from "./CancelSaveFooter.svelte";
    import Alert from "../Alert.svelte";
    import db from "../../data/db";
    import { allowTab } from "../actions";

    const dispatch = createEventDispatcher();
    const dispatchEditSuccess = (params) => dispatch("editsuccess", params);
    const dispatchCancel = () => dispatch("cancel");

    export let mapping;

    const alertInfo = `Card fields can be assigned like so:
        <br><span style="font-family: monospace;">
            card['Your Field Name'] = source['Some export source field name']
        </span>`;

    async function onSubmit() {
        let isNew = !mapping.id;
        if (isNew) {
            await db.mappings.put(mapping);
        } else {
            await db.mappings.update(mapping.id, mapping);
        }
        dispatchEditSuccess({ isNew: isNew });
    }

    const isNewFieldMapping = () => !mapping.id;
</script>

<Modal contentStyle={"width: 80%; height: auto;"} on:clickoutside={dispatchCancel}>
    <h6>{isNewFieldMapping() ? "New" : "Edit"} Field Mapping</h6>
    <form
        id="mappingForm"
        class="flex-grow-1"
        on:submit|preventDefault={onSubmit}
    >
        <input
            bind:value={mapping.notePattern}
            class="form-control flex-grow-1"
            type="text"
            placeholder="Note Type Pattern"
            aria-label="Note Type Pattern"
        />
        <input
            bind:value={mapping.dictPattern}
            class="form-control flex-grow-1"
            type="text"
            placeholder="Source Pattern"
            aria-label="Source Pattern"
        />
        <Alert text={alertInfo} icon={"fa-solid fa-circle-info"} />
        <textarea
            use:allowTab
            bind:value={mapping.script}
            class="form-control"
            type="text"
            placeholder="Mapping script"
            rows="12"
        />
    </form>
    <CancelSaveFooter
        form={"mappingForm"}
        on:cancel={dispatchCancel}
        on:save
    />
</Modal>

<style>
    textarea {
        font-family: monospace;
    }
</style>
