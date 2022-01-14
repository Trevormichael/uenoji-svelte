<script>
    import { onMount } from "svelte";
    import ConfigList from "./ConfigList.svelte";
    import MappingCard from "./MappingCard.svelte";
    import EditMappingModal from "./EditMappingModal.svelte";
    import db from "../../data/db";

    let mappings = [];
    export let modal;
    export let count;

    $: count = mappings.length;

    async function updateMappingList() {
        mappings = await db.mappings.toArray();
    }

    onMount(updateMappingList);

    const deleteMapping = async(event) => { 
        await db.mappings.delete(event.detail.id);
        await updateMappingList();
    };
    const editMapping = (event) => modal.open(event.detail);
</script>

<ConfigList items={mappings} let:item={i}>
    <MappingCard mapping={i} on:delete={deleteMapping} on:edit={editMapping}/>
</ConfigList>
<EditMappingModal bind:this={modal} on:close={updateMappingList}/>

