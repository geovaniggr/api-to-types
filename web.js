import main from './index.js'

const htmlAdapter = (element) => ({
    write: (value) => {
        element.insertAdjacentText('beforeend', `${value}\n`)
    },
    clear: () => element.textContent = ""
})

const getResponseFromApi = (endpoint) => fetch(endpoint, { mode: 'cors'}).then(response => response.json())

const parseTextArea = (textArea) => JSON.parse(textArea.value)

const typeName = document.querySelector('.base__input')
const submitBtn = document.querySelector('.base__button');
const fetchInput = document.querySelector('.base__input-fetch')
const textArea = document.querySelector('.base__textarea')
const response = document.querySelector('.base__response-textarea')
const copy = document.querySelector('.base__response-copy') 

const writer = htmlAdapter(response);

const init = async () => {
    const doesHaveToFetch = fetchInput.value && fetchInput.value.trim();
    const name = typeName.value || 'Default'

    let json;

    if(doesHaveToFetch){
        const data = await getResponseFromApi(fetchInput.value);
        json = Array.isArray(data) ? data[0] : data;
    } else {
        json = parseTextArea(textArea)
    }

    main(name, writer, json)
}

submitBtn.addEventListener('click', () => {
    writer.clear();
    init();
})

copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(response.textContent)
})

