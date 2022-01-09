let noteFields = document.getElementById('note-fields')
let searchResults = document.getElementById('search-results')
let cardInfo = document.getElementById('card-info')
let searchTermField = document.getElementById('dict-search-term')
let searchTermHistory = document.getElementById('search-term-history')
let clearAllChanges = document.getElementById('clear-all-changes')

var pendingCardChanges = {}
var noteId = -1
var searchHistory = {}

function showNoteExportModal() {
    cardModal.show()
    Mousetrap.bind('command+f', () => {
        searchTerm(getSelectionText())
    })
}

function setNoteId(id) {
    if (id != noteId)
        resetSearchCache()
    noteId = id
}

function hideNoteExportModal() {
    cardModal.hide()
    Mousetrap.unbind('command+f')
}

function resetNoteModal() {
    pendingCardChanges = {}
    searchTermField.value = ""
    noteFields.parentNode.scrollTop = 0
    searchResults.parentNode.scrollTop = 0
}

function resetSearchCache() {
    searchHistory = {}
    searchTermHistory.innerHTML = ""
}

clearAllChanges.addEventListener('click', event => {
    pendingCardChanges = {}
    updateCardPreview(getCardDataWithPendingChanges())
})

document.getElementById("dict-search-form").addEventListener('submit', event => {
    searchTermField.blur();
    searchTerm(searchTermField.value);
    event.preventDefault();
})

document.getElementById("export-changes").addEventListener('click', async(event) => {
    var id = getCardPreviewId()
    console.log('applying changes')
    console.log(pendingCardChanges)
    await updateNoteFields(id, pendingCardChanges)
    await db.exportedNotes.put({ noteId: id })
    hideNoteExportModal()
    updateNoteQueryResults()
})

document.getElementById("search-results").addEventListener('click', async(event) => {
    if (event.target.classList.contains('export-def')) {
        var data = JSON.parse(decodeURIComponent(event.target.closest("li").getAttribute('data')))

        var textHighlightNode = window.getSelection().anchorNode.parentNode
        if (textHighlightNode != null) {
            var closestLiToHighlight = textHighlightNode.closest('li')
            var closestLiToButton = event.target.closest('li')
            if (closestLiToHighlight == closestLiToButton) {
                data.selection = getSelectionText()
            }
        }

        var mappings = (await db.mappings.toArray());
        if (mappings.length > 0) {
            var cardModelName = getCardPreviewModelName()
            var mapping = mappings.find(m => {
                let dictNameExp = new RegExp(m.dictName, 'i')
                let noteTypeExp = new RegExp(m.noteType, 'i')
                return dictNameExp.test(data.dictName) && noteTypeExp.test(cardModelName)
            });
            if (mapping != null) {
                eval(mapping.script)
                var cardData = getCardDataWithPendingChanges();
                // from eval
                var output = mapData(data, cardData)
                for (const field in output) {
                    if (cardData.hasOwnProperty(field)) {
                        pendingCardChanges[field] = output[field]
                    }
                }
                updateCardPreview(getCardDataWithPendingChanges())
            }
        }
    }
})

searchTermHistory.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'a') {
        searchTerm(event.target.innerText)
    }
})

async function updateCardPreview(data) {
    var noteType = getCardPreviewModelName()
    var excludedFields = await db.fieldExclusions.where({ noteType: noteType }).first()
    var fields = []
    if (excludedFields != null)
        fields = excludedFields.fields
    var filteredData = {}
    for (const d in data) {
        if (!fields.includes(d)) {
            filteredData[d] = data[d]
        }
    }

    bindObjectFields('#note-info-template', '#note-fields', filteredData, (el, field, value) => {
        var spans = el.querySelectorAll('span')
        spans[0].textContent = field
        spans[1].innerHTML = value
        if (pendingCardChanges.hasOwnProperty(field)) {
            el.classList.add('bg-primary')
        } else {
            el.classList.remove('bg-primary')
        }
    });
}

function setCardData(card) {
    var fields = {}
    for (const f in card.fields) {
        fields[f] = card.fields[f].value
    }
    cardInfo.setAttribute('modelName', card.modelName)
    cardInfo.setAttribute('id', card.noteId)
    cardInfo.setAttribute('data', encodeURIComponent(JSON.stringify(fields)))
}

function searchCardField(fieldName) {
    searchTerm(getCardData()[fieldName])
}

function getCardDataWithPendingChanges() {
    var data = getCardData()
    for (const field in pendingCardChanges) {
        if (data.hasOwnProperty(field)) {
            data[field] = pendingCardChanges[field]
        }
    }
    return data
}

function getCardData() {
    return JSON.parse(decodeURIComponent(cardInfo.getAttribute('data')))
}

function getCardPreviewId() {
    return parseInt(cardInfo.getAttribute('id'))
}

function getCardPreviewModelName() {
    return cardInfo.getAttribute('modelName')
}

function updateSearchTabsForTerm(t) {
    var found = false
    searchTermHistory.querySelectorAll('a').forEach(a => {
        if (a.innerText === t) {
            a.classList.add('active')
            found = true
        } else {
            a.classList.remove('active')
        }
    })
    if (!found) {
        searchTermHistory.innerHTML += "<li class=\"nav-item\"> <a class=\"nav-link active\">" +
            t +
            "</a> </li>"
    }
}

async function searchTerm(t) {
    if (t == null || t.length == 0) {
        return
    }
    console.log("Searching " + t)
    updateSearchTabsForTerm(t)
    searchResults.innerHTML = "";
    var resultsFromHistory = searchHistory[t]
    if (resultsFromHistory != null) {
        displayResults(resultsFromHistory)
        console.log("loaded results from cache")
        return
    }
    var terms = await db.terms.where("term").equals(t).toArray()
    terms.push.apply(terms, await db.terms.where("reading").equals(t).toArray())
    var dicts = await db.dicts.toArray()
    terms.forEach(t => {
        var dict = dicts.find((d) => d.id == t.dict)
        t.dictName = dict.name
        t.order = dict.order
        t.defString = t.defs.join(', ')
        t.group = dict.groupReadings
    })
    var parts = partition(terms, (t) => t.group)
    var grouped = groupBy(parts[0], (t) => {
        return t.term + '_' + t.reading + '_' + t.dict
    })
    var combined = Object.keys(grouped).map(key => {
        var ts = grouped[key]
        var first = ts.shift()
        if (ts.length > 0) {
            var combinedDef = ts.map(v => v.defString).join('<br>')
            first.defString += "<br>" + combinedDef
        }
        return first
    })
    Array.prototype.push.apply(combined, parts[1])
    var groupedByOrder = groupBy(combined, r => r.order)
    var finalTermList = []
    for (var i = 0; i < dicts.length; i++) {
        let group = groupedByOrder[i.toString()]
        if (group != null) {
            let sorted = group.sort((a, b) => a.freq < b.freq ? 1 : -1)
            Array.prototype.push.apply(finalTermList, sorted)
        }
    }
    var entryMappings = await db.entryMappings.toArray()
    finalTermList.forEach(t => t.defString = t.defString.replace(/\n$/, ''))
    finalTermList.map(async(t) => {
        var mapping = entryMappings.find(m => {
            let dictNameExp = new RegExp(m.dictName, 'i')
            return dictNameExp.test(t.dictName)
        })
        if (mapping != null) {
            eval(mapping.script)
                // from eval
            return await mapEntry(t)
        } else {
            return [t]
        }
    }).forEach(p => p.then(async(res) => {
        addResultsToSearchHistory(t, res)
        displayResults(res)
    }))
}

async function displayResults(res) {
    var template = document.querySelector('#term-template');
    var cardModelName = getCardPreviewModelName()
    var availableMappings = await db.mappings.toArray()
    res.forEach(t => {
        let stringified = JSON.stringify(t)
        var clone = template.content.firstElementChild.cloneNode(true);
        clone.setAttribute('data', encodeURIComponent(stringified))
        var span = clone.querySelectorAll("span");
        span[0].textContent = t.term
        span[1].textContent = t.reading
        span[2].innerHTML = t.defString
        span[3].textContent = t.dictName
        var hasMatchingMapping = availableMappings.some(m => {
            let dictNameExp = new RegExp(m.dictName, 'i')
            let noteTypeExp = new RegExp(m.noteType, 'i')
            return dictNameExp.test(t.dictName) && noteTypeExp.test(cardModelName)
        });
        if (!hasMatchingMapping) {
            let exportButton = clone.querySelector('.export-def')
            exportButton.style.display = 'none';
        }
        searchResults.appendChild(clone);
    })
}

function addResultsToSearchHistory(term, res) {
    if (!searchHistory.hasOwnProperty(term)) {
        searchHistory[term] = []
    }
    Array.prototype.push.apply(searchHistory[term], res)
}