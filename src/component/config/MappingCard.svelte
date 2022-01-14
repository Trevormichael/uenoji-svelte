<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import ConfigCard from "./ConfigCard.svelte";

    export let mapping;

    const buttons = [
        {
            icon: "fa-solid fa-pen",
            action: () => dispatch("edit", mapping),
        },
        {
            icon: "fa-solid fa-trash",
            action: () => dispatch("delete", mapping),
        },
    ];
</script>

<ConfigCard {buttons}>
    <div class="d-flex align-items-center">
        <span class="me-2">{mapping.dictPattern}</span>
        <i class="fa-solid fa-arrow-right me-2" />
        <span>{mapping.notePattern}</span>
    </div>
</ConfigCard>

<style>
    span {
        font-size: 1.2rem;
    }
</style>
