<script>
    import { flip } from "svelte/animate"
    import { quartOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";
    import ConfigCard from "../config/ConfigCard.svelte";
    const dispatch = createEventDispatcher();

    export let dicts = [];

    function getCardButtons(dict, i) {
        return [
            {
                action: () => {
                    dispatch("sortup", dict);
                },
                icon: "fa-solid fa-arrow-up",
                disabled: i == 0,
            },
            {
                action: () => {
                    dispatch("sortdown", dict);
                },
                icon: "fa-solid fa-arrow-down",
                disabled: i == dicts.length - 1,
            },
        ];
    }
</script>

<ul>
    {#each dicts as dict, i (dict.id)}
        <li animate:flip={{ easing: quartOut, duration: 400 }} class="mx-2 mb-2">
            <ConfigCard buttons={getCardButtons(dict, i)}>
                {dict.name}
            </ConfigCard>
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
</style>
