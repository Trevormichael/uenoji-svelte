let nav = document.getElementById("nav")

nav.addEventListener('click', event => {
    console.log(event)
    if (event.target.tagName.toLowerCase() === 'a') {
        document.querySelectorAll("#nav a").forEach(node => {
            node.classList.remove('active')
        });
        event.target.classList.add('active')
        let tabId = event.target.getAttribute('tab-id')
        document.querySelectorAll(".tab-content").forEach(el => {
            if (el.id === tabId) {
                el.style = "";
            } else {
                el.style = "display: none;"
            }
        });
    }
})