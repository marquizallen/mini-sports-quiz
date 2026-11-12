const container = document.getElementById('container')
const submitName = document.getElementById('submitName')
const questionsContainer = document.getElementById('questionsContainer')

submitName.addEventListener('click', async(e) => {
    const name = document.getElementById('nameInput').value;
    console.log(name);

    if(name.trim() ==='') {
        alert("Please enter a valid name");
    } else {   
        sendName(name);
        const newDiv = document.createElement('div');
        const html = await getHtmlFile("/categorySelection");
        newDiv.innerHTML = html;
        questionsContainer.appendChild(newDiv);
     
    }


});

async function getHtmlFile(url){
    try {
        const response = await fetch (url);

        if(!response.ok) {
            throw new Error(`HTTP Error! Status : ${response.status}`);
        }
       const html = await response.text();
       return html;

    } catch (error) {
        console.log('Error');
    }
}

async function sendName(name) {

    try {
        const response = await fetch('/process-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text_input: name
            })
        });

        const data = await response.json();

        if(response.ok) {
            window.location.href="/categorySelection"
        }

        console.log(data.result);

    } catch (error) {
        console.error('Error:', error);
    }
}

getNbaQuestions();