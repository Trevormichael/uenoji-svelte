<script>
    import ConfigEntityHeader from "./config/ConfigEntityHeader.svelte";
</script>

<div class="p-3">
    <ConfigEntityHeader title={"Field Mappings"} buttonText={"New Field Mapping"}/>
    <ConfigEntityHeader title={"Dictionary Entry Mappings"} buttonText={"New Entry Mapping"}/>
    <ConfigEntityHeader title={"Note Field Filters"} buttonText={"New Filter"}/>
    <h6>Export Configuration</h6>
    <div>
        <button id="export-config" class="btn btn-primary">Export</button>
    </div>
</div>
