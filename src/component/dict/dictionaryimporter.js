import JSZip from '../../lib/jszip.min.js';
import db from '../../data/db'

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