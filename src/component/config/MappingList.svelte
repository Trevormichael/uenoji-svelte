<script>
    import { onMount } from "svelte";
    import ConfigList from "./ConfigList.svelte";
    import MappingCard from "./MappingCard.svelte";
    import EditMappingModal from "./EditMappingModal.svelte";
    import db from "../../data/db";

    let selectedMapping;
    let mappings = [];

    export let count;
    $: count = mappings.length;

    export const startNewMapping = () => { selectedMapping =  {}; };

    async function updateMappingList() {
        mappings = await db.mappings.toArray();
    }

    onMount(updateMappingList);

    const deleteMapping = async (event) => {
        await db.mappings.delete(event.detail.id);
        await updateMappingList();
    };
    const editMapping = (event) => { selectedMapping = event.detail };
    const onEditCancel = () => { selectedMapping = null; };
    const onEditSuccess = () => {
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
