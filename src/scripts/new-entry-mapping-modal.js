document.getElementById("entry-mapping-form").addEventListener('submit', event => {
    var mapping = {}
    mapping.dictName = document.getElementById("mapping-dict-name").value;
    mapping.script = document.getElementById("entry-mapping-script").value;
    db.entryMappings.put(mapping).then(() => {
        entryMappingModal.hide();
        updateEntryMappingList();
    }).catch(error => {
        console.log(error);
    });
    event.preventDefault();
})