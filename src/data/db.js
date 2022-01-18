import Dexie from "../lib/dexie.min.js";
import { groupBy } from "../scripts/common";

var db = new Dexie("Dictionaries")

db.version(1).stores({
    terms: `++id, term, reading, defs, dictId, freq, seq, defTags, termTags, rules`,
    kanji: `++id, kanji, onyomi, kunyomi, tags, meanings, dictId`,
    dicts: `++id, name, format, rev, order, groupReadings`,
    mappings: `++id, notePattern, dictPattern, script`,
    prefs: `&key, value`,
    exportedNotes: `&noteId`,
})

export default db

export async function getTopTerm(term, where) {
    let terms = await db.terms.where({ term: term }).toArray();
    if (where)
        terms = terms.filter(where)
    let dicts = await db.dicts.toArray();
    let orderedIds = dicts
        .sort((a, b) => a.order > b.order ? 1 : -1)
        .map(d => d.id);
    let grouped = groupBy(terms, t => t.dictId);
    for (var i = 0; i < orderedIds.length; i++) {
        let id = orderedIds[i];
        if (grouped.hasOwnProperty(id)) {
            return grouped[id].reduce((prev, curr) => {
                return (prev.freq > curr.freq) ? prev : curr
            })
        }
    }

    return null;
}

export async function getTopReading(term) {
    let topTerm = await getTopTerm(term, t => t.reading)
    return topTerm.reading;
}