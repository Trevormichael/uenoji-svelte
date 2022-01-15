import JSZip from '../../lib/jszip.min.js';
import db from '../../data/db'

const kanjiImporter = {
    table: db.kanji,
    parse: (o, dictId) => {
        return {
            kanji: o[0],
            onyomi: o[1],
            kunyomi: o[2],
            tags: o[3],
            meanings: o[4],
            dictId: dictId
        }
    }
}

const standardImporter = {
    table: db.terms,
    parse: (o, dictId) => {
        return {
            term: o[0],
            reading: o[1],
            defs: o[5],
            dictId: dictId,
            freq: o[4],
            seq: o[6],
            defTags: o[2],
            termTags: o[7],
            rules: o[3]
        }
    }
}

function getImporterForFile(file) {
    if (file.name.startsWith("term_bank_"))
        return standardImporter;
    else if (file.name.startsWith("kanji_bank"))
        return kanjiImporter;
    else
        return null;
}

async function importDictionary(file, onProgress, onError) {
    let zip = new JSZip();
    let res = await zip.loadAsync(file)
    let di = JSON.parse(await res.files['index.json'].async("string"))
    let dictCount = (await db.dicts.toArray()).length
    let existing = await db.dicts.where({ name: di.title }).toArray();
    if (existing.length > 0) {
        onError("A dictionary with the same name is already imported.")
        return;
    }
    let dictId = await db.dicts.put({ name: di.title, format: di.format, rev: di.revision, order: dictCount })
    let importers = Object.values(res.files).map(f => {
        return {
            file: f,
            importer: getImporterForFile(f)
        };
    }).filter(i => i.importer !== null);
    let total = importers.length;
    for (var i = 0; i < total; i++) {
        let file = importers[i].file;
        let importer = importers[i].importer;
        var text = await file.async("string");
        try {
            var obj = JSON.parse(text)
            await importer.table.bulkPut(obj.map(o => importer.parse(o, dictId)))
            await new Promise(r => setTimeout(r, 500));
            if (onProgress)
                onProgress((i + 1) / total);
        } catch (error) {
            console.log(error)
        }
    }
}

export default {
    importDictionary
}