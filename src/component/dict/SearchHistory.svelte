<script>
    import Nav from "../Nav.svelte";

    export let term;

    let termNavOptions = [];
    let selected;

    function getTermNavOption(t) {
        return termNavOptions.find((op) => {
            return op.name == t;
        });
    }

    function addTerm(t) {
        if (t == null || t == undefined) return;

        let existing = getTermNavOption(t);
        if (!existing) {
            termNavOptions.push({ name: t });
        }
    }

    $: {
        addTerm(term);
        selected = getTermNavOption(term);
    }
</script>

<Nav on:select options={termNavOptions} {selected} />
