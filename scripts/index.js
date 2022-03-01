const APIURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
const formEl = document.getElementById("search-form");
const definitionEl = document.getElementById('definition-el');
const searchTextEl = document.getElementById('search-text');

formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    await getWordDefinition(searchTextEl.value);
})

async function getWordDefinition(word) {
    const url = APIURL + word;
    const jsonData = await fetch(url).then(res => res.json());
    
    let definitionsHtml = `<h4>Definition of ${jsonData[0].word}</h4>`;
    definitionsHtml += getPhonetics(jsonData[0].phonetics);
    definitionsHtml += displayDefinitions(jsonData[0].meanings);
    definitionEl.innerHTML = definitionsHtml;
    //console.log(jsonData);
}

//returns meanings of a word including examples.
function displayDefinitions(meanings) {
    if (!meanings) {
        definitionEl.innerHTML = "<p>No match found!</p>";
        return;
    }
    let definitionsHtml = '';

    let definitionCounter = 1;
    meanings.forEach(meaning => {
        definitionsHtml += getPartOfSpeech(meaning);

        meaning.definitions.forEach(definition => {
            definitionsHtml += `<p><small class="index">${definitionCounter}.</small> ${definition.definition}</p>`;
            definitionCounter++;

            if (!isEmpty(definition.example)) {
                definitionsHtml += `<small>example: "${definition.example}"</small>`;
            }
        });
    });
    return definitionsHtml;
}

function getPartOfSpeech(meaning) {
    return `<em>${meaning.partOfSpeech}:</em>`;
}

function getPhonetics(phonetics) {
    let phoneticsHtml = '<div class="phonetics"><ul>';
    phonetics.forEach(phonetic => {
        const hasAudio = !isEmpty(phonetic.audio); //add pronunciation, if available

        if (!isEmpty(phonetic.text)) {
            if (hasAudio) {
                phoneticsHtml += `<a href="${phonetic.audio}" target="_blank">`
            }
            phoneticsHtml += `<li>${phonetic.text}</li>`;
            
            if (hasAudio) {
                phoneticsHtml += `</a>`
            }
        }
    })
    phoneticsHtml += '</ul></div>';
    return phoneticsHtml;
}

function isEmpty(text) {
    return text === undefined || !text;
}