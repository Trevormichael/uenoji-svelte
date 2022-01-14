<script>
    import Modal from "../Modal.svelte";
    import CancelSaveFooter from "./CancelSaveFooter.svelte";
    import Alert from "../Alert.svelte";
    import db from "../../data/db";
    import { allowTab } from "../actions";

    let fieldMapping;
    let modal;

    const alertInfo = `Card fields can be assigned like so:
        <br><span style="font-family: monospace;">
            card['Your Field Name'] = source['Some export source field name']
        </span>`;

    async function onSubmit() {
        if (fieldMapping.id) {
            await db.mappings.update(fieldMapping.id, fieldMapping);
        } else {
            await db.mappings.put(fieldMapping);
        }
        modal.close();
    }

    export const open = (fm) => {
        fieldMapping = fm || {
            notePattern: '',
            dictPattern: '',
            script: ''
        };
        modal.open();
    };

    const isNewFieldMapping = () => !fieldMapping.id;
</script>

<Modal bind:this={modal} contentStyle={"width: 80%; height: auto;"} on:close>
    <h6>{isNewFieldMapping() ? "New" : "Edit"} Field Mapping</h6>
    <form
        id="mappingForm"
        class="flex-grow-1"
        on:submit|preventDefault={onSubmit}
    >
        <input
            bind:value={fieldMapping.notePattern}
            class="form-control flex-grow-1"
            type="text"
            placeholder="Note Type Pattern"
            aria-label="Note Type Pattern"
        />
        <input
            bind:value={fieldMapping.dictPattern}
            class="form-control flex-grow-1"
            type="text"
            placeholder="Source Pattern"
            aria-label="Source Pattern"
        />
        <Alert text={alertInfo} icon={"fa-solid fa-circle-info"} />
        <textarea
            use:allowTab
            bind:value={fieldMapping.script}
            class="form-control"
            type="text"
            placeholder="Mapping script"
            rows="12"
        />
    </form>
    <CancelSaveFooter
        form={"mappingForm"}
        on:cancel={() => {
            modal.close();
        }}
        on:save
    />
</Modal>

<style>
    textarea {
        font-family: monospace;
    }
</style>
