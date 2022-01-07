document.getElementById("mapping-form").addEventListener('submit', event => {
    var mapping = {}
    mapping.noteType = document.getElementById("note-type").value;
    mapping.dictName = document.getElementById("dict-name").value;
    mapping.script = document.getElementById("mapping-script").value;
    console.log(mapping)
    db.mappings.put(mapping).then(() => {
        mappingModal.hide();
        updateMappingList();
    }).catch(error => {
        console.log(error);
    });
    event.preventDefault();
})