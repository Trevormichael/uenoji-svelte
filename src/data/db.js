import Dexie from '../lib/dexie.min.js'

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