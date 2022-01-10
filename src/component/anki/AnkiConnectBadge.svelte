<script>
    import { onMount } from "svelte";
    import anki from "../../scripts/anki-connect.js";

    var connected = true;

    async function fetchDeckNames() {
        let deckNames = await anki.invoke("deckNames", {});
        connected = deckNames != null;
    }

    onMount(() => {
        fetchDeckNames();
    });
</script>

<h6>
    AnkiConnect
    <span class="badge {connected ? "bg-success" : "bg-danger"}">
        {connected ? "Connected" : "Disconnected"}
    </span>
</h6>
