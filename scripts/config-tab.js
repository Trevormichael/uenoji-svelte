var mappingModal = new bootstrap.Modal(document.getElementById("mapping-modal"));
var entryMappingModal = new bootstrap.Modal(document.getElementById("entry-mapping-modal"));
var filterModal = new bootstrap.Modal(document.getElementById("filter-modal"));

document.getElementById("new-mapping").addEventListener('click', event => {
    mappingModal.show();
})

document.getElementById("new-entry-mapping").addEventListener('click', event => {
    entryMappingModal.show();
})

document.getElementById("new-filter").addEventListener('click', event => {
    filterModal.show();
})

document.getElementById("delete-mappings").addEventListener('click', event => {
    db.mappings.clear().then(() => {
        updateMappingList();
    })
})

document.getElementById("delete-entry-mappings").addEventListener('click', event => {
    db.entryMappings.clear().then(() => {
        updateEntryMappingList();
    })
})

document.getElementById("delete-filters").addEventListener('click', event => {
    db.fieldExclusions.clear().then(() => {
        updateFilterList();
    })
})

async function updateMappingList() {
    var m = await db.mappings.toArray();
    bindGenericList('mapping-list', m)
}

updateMappingList();

async function updateFilterList() {
    var f = await db.fieldExclusions.toArray();
    bindGenericList('filter-list', f)
}

updateFilterList();

async function updateEntryMappingList() {
    var f = await db.entryMappings.toArray();
    bindGenericList('entry-mapping-list', f)
}

updateEntryMappingList();