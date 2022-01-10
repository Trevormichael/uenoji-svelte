<script>

</script>

<h2>Dictionaries</h2>
<div class="row">
    <h6>Add Dictionary</h6>
    <div class="col-6">
        <div class="mb-3">
            <input class="form-control" type="file" id="formFile" accept=".zip">
        </div>
    </div>
    <div class="col-3">
        <button id="save-dict" class="btn btn-primary">Save</button>
    </div>
</div>
<div class="row pt-2">
    <div class="col-6">
        <ul id="dict-list" class="list-group custom-list">
        </ul>
    </div>
    <div class="col-6 panel p-3" id="dict-config" style="display: none;">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="group-terms-by-reading">
            <label class="form-check-label" for="flexSwitchCheckDefault">Group terms by reading</label>
        </div>
    </div>
</div>