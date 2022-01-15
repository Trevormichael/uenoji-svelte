<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { autoexpand } from "../actions";
    const dispatch = createEventDispatcher();

    export let note;
    export let fields = [];

    export function applyChanges(changes) {
        fields = fields.map((f) => {
            if (changes.hasOwnProperty(f.key)) {
                let newValue = changes[f.key];
                if (newValue !== f.value) {
                    return { key: f.key, value: newValue };
                }
            }
            return f;
        });
    }

    export function clearChanges() {
        setFieldsFromNote(note);
    }

    export function getChanges() {
        let changes = {};
        fields.filter(isChangedFromNote).map((f) => {
            changes[f.key] = f.value;
        });
        return changes;
    }

    function setFieldsFromNote(n) {
        if (n == null) return [];

        let f = n.fields || {};
        fields = Object.keys(f).map((key) => {
            return { key: key, value: f[key].value };
        });
    }

    function isChangedFromNote(field) {
        return (
            !note.fields.hasOwnProperty(field.key) ||
            field.value !== note.fields[field.key].value
        );
    }

    function checkForFieldChanges(fields) {
        let hasChanges = fields.some(isChangedFromNote);
        dispatch("fieldchange", { hasChanges: hasChanges });
    }

    $: setFieldsFromNote(note);
    $: checkForFieldChanges(fields);
</script>

<div class="listContainer flex-grow-1">
    <ul class="d-flex flex-column m-1 me-2 p-3">
        {#each fields as field}
            <li class="flex-shrink-1">
                <div class="label">{field.key}</div>
                <div
                    bind:innerHTML={field.value}
                    use:autoexpand
                    contenteditable="true"
                    class="mousetrap form-control flex-grow-1 value"
                    type="text"
                    placeholder="Empty Field..."
                    aria-label="Empty Field..."
                />
            </li>
        {/each}
    </ul>
</div>

<style>
    .listContainer {
        overflow: auto;
        overflow-x: hidden;
    }

    ul {
        overflow: auto;
        list-style-type: none;
        padding: 10px;
        margin: 10px;
        background-color: var(--card-color);
        border-radius: 5px;
    }

    .label {
        font-size: 0.8rem;
        color: #ffffffcc;
    }

    .value {
        font-size: 1rem;
        list-style-type: initial;
        list-style-position: inside;
        margin: 0;
        height: auto;
        overflow: hidden;
        resize: none;        
    }
    .value:empty:not(:focus):before {
        content: attr(placeholder);
        color: #ffffff30;
    }
</style>
