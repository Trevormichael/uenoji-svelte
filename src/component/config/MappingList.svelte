<script>
    import { onMount } from "svelte";
    import ConfigList from "./ConfigList.svelte";
    import MappingCard from "./MappingCard.svelte";
    import EditMappingModal from "./EditMappingModal.svelte";
    import db from "../../data/db";
    import { show } from "../toast/toast";
    import { confirm } from "../modal/confirmation";

    let selectedMapping;
    let mappings = [];

    export let count;
    $: count = mappings.length;

    export const startNewMapping = () => {
        selectedMapping = {};
    };

    async function updateMappingList() {
        mappings = await db.mappings.toArray();
    }

    onMount(updateMappingList);

    const deleteMapping = async (event) => {
        confirm(
            "Are you sure you want to delete this field mapping?",
            "Delete",
            async () => {
                await db.mappings.delete(event.detail.id);
                await updateMappingList();
            }
        );
    };
    const editMapping = (event) => {
        selectedMapping = event.detail;
    };
    const onEditCancel = () => {
        selectedMapping = null;
    };
    const onEditSuccess = (event) => {
        let isNew = event.detail.isNew;
        let message = isNew ? "Field mapping created." : "Field mapping updated.";
        show(message, "success", 3000);
        selectedMapping = null;
        updateMappingList();
    };
</script>

<ConfigList items={mappings} let:item={i}>
    <MappingCard mapping={i} on:delete={deleteMapping} on:edit={editMapping} />
</ConfigList>
{#if selectedMapping}
    <EditMappingModal
        mapping={selectedMapping}
        on:editsuccess={onEditSuccess}
        on:cancel={onEditCancel}
    />
{/if}
