let ankiConnectionStatus = document.getElementById("anki-connect-badge")
let queryForm = document.getElementById("query-form")
let queryText = document.getElementById("anki-query")
let hidePrevExportToggle = document.getElementById('hidePrevExports')
let resCount = document.getElementById("res-count")
let results = document.getElementById("query-results")

var cardModal = new bootstrap.Modal(document.getElementById("card-modal"));

queryForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    updateNoteQueryResults();
});

cardModal.addEventListener('hidden.bs.modal', () => {
    resetNoteModal
})

async function updateNoteQueryResults() {
    var hidePrevExports = hidePrevExportToggle.checked;
    var query = queryText.value;
    db.prefs.put({ key: 'latestQuery', value: query })
    res = await invoke("findNotes", { query: query })
    if (res.result != null) {
        var noteIds = res.result
        if (hidePrevExports) {
            noteIds = (await Promise.all(res.result.map(async(noteId) => {
                var prevExported = await db.exportedNotes.get({ noteId: noteId })
                if (prevExported != null) {
                    return -1
                } else {
                    return noteId
                }
            }))).filter(noteId => noteId != -1)
        }
        resCount.innerText = noteIds.length + " results found."
        var cardRes = await invoke("notesInfo", { notes: noteIds })
        if (cardRes.result != null) {
            var newList = ""
            cardRes.result.forEach(card => {
                var fields = {}
                for (const f in card.fields) {
                    fields[f] = card.fields[f].value
                }
                newList += "<li id=" + card.noteId +
                    " class=\"list-group-item card-prev\">" +
                    escapeHtml(JSON.stringify(fields)) +
                    "</li>"
            })
            results.innerHTML = newList
        }
        if (noteIds.length == 1) {
            loadNoteInfoModal(noteIds[0])
        }
    }
}

results.addEventListener('click', event => {
    console.log(event)
    if (event.target.tagName.toLowerCase() === 'li') {
        event.target.parentNode.childNodes.forEach(node => {
            node.classList.remove('active')
        });
        event.target.classList.add('active')
        var noteId = parseInt(event.target.id)
        loadNoteInfoModal(noteId)
    }
})

hidePrevExportToggle.addEventListener('change', async(event) => {
    await db.prefs.put({ key: 'hidePrevExports', value: hidePrevExportToggle.checked })
})

async function loadLatestQuery() {
    var query = await db.prefs.get('latestQuery')
    var hidePrevExports = await db.prefs.get('hidePrevExports')
    if (query != null)
        queryText.value = query.value;
    if (hidePrevExports != null)
        hidePrevExportToggle.checked = hidePrevExports
}

function loadNoteInfoModal(noteId) {
    invoke("notesInfo", { notes: [noteId] }).then(cardRes => {
        if (cardRes.result != null) {
            showNoteExportModal()
            setCardData(cardRes.result[0])
            updateCardPreview(getCardDataWithPendingChanges())
            searchCardField('Vocab')
        }
    });
}

loadLatestQuery();

invoke("deckNames", {}).then(res => {
    console.log(res);
    if (res.result != null) {
        ankiConnectionStatus.innerText = "Connected"
        ankiConnectionStatus.className = "badge bg-success"
    } else {
        ankiConnectionStatus.innerText = "Disconnected"
        ankiConnectionStatus.className = "badge bg-danger"
    }
});