<script>

</script>

<div class="row">
    <div class="col-6">
        <form id="query-form">
            <input id="anki-query" class="form-control" type="text" placeholder="Query" aria-label="Query">
        </form>
    </div>
    <div class="col-3">
        <button id="execute-query" form="query-form" type="submit" class="btn btn-primary">Execute</button>
    </div>
</div>
<div class="row pt-2">
    <div class="col-6">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="hidePrevExports">
            <label class="form-check-label" for="flexSwitchCheckDefault">Hide previously exported notes</label>
        </div>
    </div>
</div>
<div class="row pt-2">
    <div class="col-6">
        <div class="panel px-2">
            <p id="res-count">0 results found.</p>
        </div>
    </div>
</div>
<div class="row pt-2">
    <div class="col-12">
        <ul id="query-results" class="list-group">
        </ul>
    </div>
</div>