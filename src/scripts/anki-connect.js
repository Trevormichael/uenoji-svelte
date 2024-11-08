async function postData(url = '', data = {}) {
    // Default options are marked with *
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
        console.log(error);
        return null;
    }
}

function invoke(action, params = {}) {
    return postData('http://127.0.0.1:8765', { action, version: 6, params });
}

async function updateNoteFields(noteId, fields) {
    return invoke("updateNoteFields", {
        note: {
            id: noteId,
            fields: fields
        }
    })
}

async function queryNotes(query) {
    let res = await invoke("findNotes", { query: query })
    if (res != null) {
        let noteIds = res.result
        let noteRes = await invoke("notesInfo", { notes: noteIds })
        if (noteRes != null)
            return noteRes.result
    }

    return []
}

async function noteInfo(noteId) {
    let noteRes = await invoke("notesInfo", { notes: [noteId] });
    if (noteRes != null)
        return noteRes.result[0];

    return null;
}

export default {
    invoke,
    updateNoteFields,
    queryNotes,
    noteInfo
}