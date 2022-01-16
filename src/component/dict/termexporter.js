import db from "../../data/db";
import ankinote from "../anki/ankinote";
import { nullOrBlank } from "../../scripts/common"

let mappings;

async function getMappings() {
    if (!mappings)
        mappings = await db.mappings.toArray();
    return mappings
}

function clearCache() {
    mappings = null;
}

function testMapping(mapping, noteType, sourceType) {
    let notePattern = new RegExp(mapping.notePattern);
    let dictPattern = new RegExp(mapping.dictPattern);
    return notePattern.test(noteType) && dictPattern.test(sourceType);
}

async function hasMapping(noteType, sourceType) {
    return (await getMappings()).some(m => {
        return testMapping(m, noteType, sourceType)
    })
}

async function getMapping(noteType, sourceType) {
    return (await getMappings()).find(m => {
        return testMapping(m, noteType, sourceType)
    })
}

const mapTermToFieldChanges = async(term, selection, note) => {
    let mapping = await getMapping(note.modelName, term.dictName);
    if (mapping === null) return;

    let fnBody = mapping.script;
    if (selection) {
        term.defString = selection;
    }
    let fn = new Function("card", "source", fnBody);
    let modified = ankinote.getFields(note);
    modified.append = (key, value) => {
        if (nullOrBlank(modified[key])) {
            modified[key] = value;
        } else {
            modified[key] = modified[key] + `<br>${value}`
        }
    }
    fn.call(null, modified, term);
    let changes = Object.keys(modified)
        .filter(key => {
            return note.fields.hasOwnProperty(key) && note.fields[key].value !== modified[key]
        }).reduce((res, key) => {
            res[key] = modified[key]
            return res;
        }, {})
    return changes;
};

export default {
    mapTermToFieldChanges,
    hasMapping,
    clearCache
};