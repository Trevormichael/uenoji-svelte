function bindObjectFields(templateSelector, containerSelector, obj, binder) {
    var container = document.querySelector(containerSelector)
    var template = document.querySelector(templateSelector)
    container.innerHTML = ""
    for (const f in obj) {
        var value = obj[f]
        var clone = template.content.firstElementChild.cloneNode(true)
        binder(clone, f, value)
        container.appendChild(clone)
    }
}

function bindList(templateSelector, containerSelector, data, binder) {
    var container = document.querySelector(containerSelector)
    var template = document.querySelector(templateSelector)
    container.innerHTML = ""
    data.forEach(d => {
        var clone = template.content.firstElementChild.cloneNode(true)
        binder(clone, d)
        container.appendChild(clone)
    })
}

function bindGenericList(containerSelector, data) {
    var el = document.getElementById(containerSelector)
    el.innerHTML = "";
    var listStr = "";
    data.forEach(m => {
        listStr += "<li class=\"list-group-item\">" + escapeHtml(JSON.stringify(m)) + "</li>"
    });
    el.innerHTML = listStr;
}