import db from '../../data/db'
import { partition, groupBy } from '../../scripts/common'

export async function searchTerm(t) {
    if (t == null || t.length == 0) {
        return
    }

    var terms = await db.terms.where("term").equals(t).toArray()
    let kanji = [];
    for (var i = 0; i < t.length; i++) {
        let k = await db.kanji.where("kanji").equals(t[i]).toArray();
        if (k != null) Array.prototype.push.apply(kanji, k);
    }
    terms.push.apply(terms, await db.terms.where("reading").equals(t).toArray())
    var dicts = await db.dicts.toArray()
    terms.forEach(t => {
        var dict = dicts.find((d) => d.id == t.dictId)
        t.dictName = dict.name
        t.order = dict.order
        t.defString = t.defs.join(', ')
        t.group = dict.groupReadings
        t.heading = "Terms"
    })
    let kanjiAsTerms = kanji.map(k => {
        return {
            term: k.kanji,
            reading: `${k.onyomi} | ${k.kunyomi}`,
            defs: k.meanings,
            defString: k.meanings.join(", "),
            order: -1,
            heading: "Kanji",
            dictName: dicts.find(d => d.id == k.dictId).name
        };
    })
    var parts = partition(terms, (t) => t.group)
    var grouped = groupBy(parts[0], (t) => {
        return t.term + '_' + t.reading + '_' + t.dictId
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
    finalTermList.forEach(t => t.defString = t.defString.replace(/\n$/, ''))
    Array.prototype.push.apply(kanjiAsTerms, finalTermList)
    return kanjiAsTerms;
}