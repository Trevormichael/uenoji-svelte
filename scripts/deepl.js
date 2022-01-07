let deeplUrl = 'https://api-free.deepl.com/v2/translate'

async function deeplTranslate(text, toLanguage, apiKey) {
    var url = new URL(deeplUrl)
    const params = {
        'auth_key': apiKey,
        'target_lang': toLanguage,
        'text': text
    }
    url.search = new URLSearchParams(params)
    const response = await fetch(url, { method: 'GET' })
    return response.json()
}