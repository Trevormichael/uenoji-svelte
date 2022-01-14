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

async function importDictionary(file, onProgress) {
    let zip = new JSZip();
    let res = await zip.loadAsync(file)
    let di = JSON.parse(await res.files['index.json'].async("string"))
    let dictCount = (await db.dicts.toArray()).length
    let dictId = await db.dicts.put({ name: di.title, format: di.format, rev: di.revision, order: dictCount })
    let fileCount = res.files.length;
    let current = 0;
    for (const key in res.files) {
        var f = res.files[key]
        let importer = getImporterForFile(f);
        if (importer != null) {
            var text = await f.async("string");
            try {
                var obj = JSON.parse(text)
                await importer.table.bulkPut(obj.map(o => importer.parse(o, dictId)))
                current++;
                if (onProgress)
                    onProgress(current / fileCount);
            } catch (error) {
                console.log(error)
            }
        }
    }
}

export default {
    importDictionary
}