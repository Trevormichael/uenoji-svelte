function getFieldValue(note, fieldName) {
    if (note == null)
        return null

    if (note.fields.hasOwnProperty(fieldName)) {
        return note.fields[fieldName].value;
    }
    return null;
}

export default {
    getFieldValue
}