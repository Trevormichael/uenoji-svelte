<script>
    export let text;
    export let icon;
</script>

<div class="alert alert-primary customAlert my-2 p-2 d-flex align-items-center" role="alert">
    <i class="{icon} me-2" />     
    <div>{@html text}</div>
</div>

<style>
    .alert {
        font-size: 0.9em;
        font-style: italic;
    }
</style>