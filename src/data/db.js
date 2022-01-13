import Dexie from '../lib/dexie.min.js'

var db = new Dexie("Dictionaries")

db.version(1).stores({
    terms: `++id, term, reading, defs, dict, freq, seq, defTags, termTags, rules`,
    dicts: `++id, name, format, rev, order, groupReadings`,
    mappings: `++id, noteType, dictName, script`,
    prefs: `&key, value`,
    fieldExclusions: `++id, noteType, fields`,
    entryMappings: `&dictName, script`,
    exportedNotes: `&noteId`,
})

db.version(2).stores({
    plugins: `++id, name, config, manifest, scripts`
})

export default db