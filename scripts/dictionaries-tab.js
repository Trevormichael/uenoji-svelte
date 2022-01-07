let saveDict = document.getElementById('save-dict')
let fileInput = document.getElementById('formFile')
let dictConfig = document.getElementById('dict-config')
let groupByReadingToggle = document.getElementById('group-terms-by-reading')

saveDict.addEventListener('click', () => {
    loadDict();
})

function getSelectedDictId() {
    var active = document.querySelector('.dictionary-item.active')
    if (active != null)
        return parseInt(active.id)
    return -1
}

document.getElementById('dict-list').addEventListener('click', async(event) => {
    var tagName = event.target.tagName.toLowerCase()
    if (tagName === 'i' || tagName === 'button') {
        var dictId = parseInt(event.target.closest('li').id)
        var button = event.target;
        if (tagName === 'i') {
            var button = event.target.parentNode;
        }
        if (button.classList.contains('dict-sort-up')) {
            await changeDictSortOrder(dictId, -1)
            updateDictList()
        } else if (button.classList.contains('dict-sort-down')) {
            await changeDictSortOrder(dictId, 1)
            updateDictList()
        }
    } else if (event.target.tagName.toLowerCase() === 'span') {
        event.target.closest('ul').querySelectorAll('li').forEach(l => {
            l.classList.remove('active')
        })
        event.target.closest('li').classList.add('active')
        dictConfig.style.display = ''
        updateDictConfig()
    }
})

document.getElementById('group-terms-by-reading').addEventListener('click', async(event) => {
    var id = getSelectedDictId()
    if (id != -1) {
        await db.dicts.update(id, { groupReadings: event.target.checked })
    }
})

async function updateDictConfig() {
    var id = getSelectedDictId()
    if (id != -1) {
        var dict = await db.dicts.get(id)
        var groupReadings = dict.groupReadings
        if (groupReadings == null)
            groupReadings = false
        groupByReadingToggle.checked = groupReadings
    }
}

async function changeDictSortOrder(dictId, adj) {
    var dict = await db.dicts.get(dictId)
    var count = await db.dicts.count()
    var prevPos = dict.order
    var newPos = prevPos + adj
    if (newPos < 0 || newPos >= count) {
        console.log('invalid sort order pos')
    } else {
        var dictToSwitch = await db.dicts.where({ order: newPos }).first()
        await db.dicts.update(dictToSwitch.id, { order: prevPos })
        await db.dicts.update(dict.id, { order: newPos })
    }
}

async function loadDict() {
    var file = fileInput.files[0]
    var zip = new JSZip();
    var res = await zip.loadAsync(file)
    let di = JSON.parse(await res.files['index.json'].async("string"))
    var dictCount = (await db.dicts.toArray()).length
    let dictId = await db.dicts.put({ name: di.title, format: di.format, rev: di.revision, order: dictCount })
    for (const key in res.files) {
        var f = res.files[key]
        if (f.name.includes("term_bank")) {
            var text = await f.async("string");
            try {
                var obj = JSON.parse(text)
                await db.terms.bulkPut(obj.map(o => {
                    return {
                        term: o[0],
                        reading: o[1],
                        defs: o[5],
                        dict: dictId,
                        freq: o[4],
                        seq: o[6],
                        defTags: o[2],
                        termTags: o[7],
                        rules: o[3]
                    }
                }))
            } catch (error) {
                console.log(error)
            }
        }
    }
    updateDictList();
}

async function updateDictList() {
    var dicts = (await db.dicts.orderBy('order').toArray())
    bindList('#dictionary-template', '#dict-list', dicts, (el, d) => {
        el.id = d.id
        var span = el.querySelector('span')
        span.innerText = d.name
    })
}

updateDictList();

async function test() {
    await db.dicts.update(1, { order: 0 })
    await db.dicts.update(2, { order: 1 })
}

test()