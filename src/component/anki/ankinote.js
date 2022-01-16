function getFieldValue(note, fieldName) {
    if (note == null)
        return null

    if (note.fields.hasOwnProperty(fieldName)) {
        return note.fields[fieldName].value;
    }
    return null;
}

function getFields(note) {
    let res = {};
    Object.keys(note.fields).forEach(key => {
        res[key] = note.fields[key].value;
    })
    return res;
}

export default {
    getFieldValue,
    getFields
}