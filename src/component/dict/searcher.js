import db from '../../data/db'
import { partition, groupBy } from '../../scripts/common'

export async function searchTerm(t, onRes) {
    if (t == null || t.length == 0) {
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
    await Promise.all(finalTermList.map(async(t) => {
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
    }).map(p => p.then(onRes)))
}