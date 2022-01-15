import db from "../../data/db";
import ankinote from "../anki/ankinote";

async function getMappingForNoteAndSourceType(noteType, sourceType) {
    let mappings = await db.mappings.toArray();
    return mappings.find(m => {
        let notePattern = new RegExp(m.notePattern);
        let dictPattern = new RegExp(m.dictPattern);
        return notePattern.test(noteType) && dictPattern.test(sourceType);
    })
}

const mapTermToFieldChanges = async(term, selection, note) => {
    let mapping = await getMappingForNoteAndSourceType(note.modelName, term.dictName);
    let fnBody = mapping.script;
    if (selection) {
        term.defString = selection;
    }
    let fn = new Function("card", "source", fnBody);
    let modified = ankinote.getFields(note);
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
    mapTermToFieldChanges
};