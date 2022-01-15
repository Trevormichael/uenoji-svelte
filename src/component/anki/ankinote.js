function getFieldValue(note, fieldName) {
    if (note == null)
        return null

    if (note.fields.hasOwnProperty(fieldName)) {
        return note.fields[fieldName].value;
    }
    return null;
}

function getFields(note) {
    return Object.keys(note.fields)
        .map(key => { return { key: note.fields[key] }; })
}

export default {
    getFieldValue,
    getFields
}