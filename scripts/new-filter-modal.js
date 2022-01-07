document.getElementById('filter-form').addEventListener('submit', event => {
    var filter = {}
    filter.noteType = document.getElementById("filter-note-type").value;
    filter.fields = document.getElementById("filter-excludes").value.split(',');
    db.fieldExclusions.put(filter).then(() => {
        filterModal.hide();
        updateFilterList();
    }).catch(error => {
        console.log(error);
    });
    event.preventDefault();
})