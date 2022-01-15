export const allowTab = (node) => {

    const handleTab = (event) => {
        if (event.key === 'Tab') {
            let value = "  ";
            let startPos = node.selectionStart;
            let endPos = node.selectionEnd;
            node.value = node.value.substring(0, startPos) + value + node.value.substring(endPos, node.value.length);
            node.selectionStart = startPos + value.length;
            node.selectionEnd = startPos + value.length;
            event.preventDefault();
        }
    }

    node.addEventListener('keydown', handleTab, true);

    return {
        destroy() {
            node.removeEventListener('keydown', handleTab, true)
        }
    }
}

export const autoexpand = (node) => {
    const onInput = (event) => {
        node.style.height = "";
        node.style.height = node.scrollHeight + "px";
    }

    node.addEventListener('input', onInput, true)

    return {
        destroy() {
            node.removeEventListener('input', onInput, true)
        }
    }
}