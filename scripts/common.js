const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

var groupBy = (xs, keySelector) => {
    return xs.reduce((rv, x) => {
        let key = keySelector(x)
        if (!rv.hasOwnProperty(key))
            rv[key] = []
        rv[key].push(x)
        return rv;
    }, {})
}

var partition = (xs, predicate) => {
    let part1 = []
    let part2 = []
    xs.forEach(element => {
        if (predicate(element))
            part1.push(element)
        else
            part2.push(element)
    });
    return [part1, part2]
}