import { toHiragana } from "wanakana";

const tokenizeUrl = "https://jp-tokenizer.herokuapp.com/tokenize";

async function tokenize(text) {
    var url = new URL(tokenizeUrl)
    const params = {
        'text': text
    }
    url.search = new URLSearchParams(params)
    try {
        const response = await fetch(url, { method: 'GET' })
        return response.json()
    } catch (error) {
        console.log(error)
        return { translations: [] }
    }
}

export async function furigana(text) {
    let tokenized = await tokenize(text);
    let res = "";
    for (var i = 0; i < tokenized.length; i++) {
        let t = tokenized[i];
        let hiragana = toHiragana(t.reading);
        if (hiragana && t.token !== hiragana) {
            if (res.length !== 0) res += " ";
            res += `${t.token}[${hiragana}]`
        } else {
            res += t.token;
        }
    }
    return res;
}