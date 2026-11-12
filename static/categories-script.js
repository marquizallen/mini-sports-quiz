const categoryDiv = document.getElementById('categoryDiv');
const nbaBtn = document.getElementById('nbaBtn');
const nflBtn = document.getElementById('nflBtn');
const boxingBtn = document.getElementById('boxingBtn');

let answeredQuestion = 0;

restartQuiz();

nbaBtn.addEventListener("click",async(e)=>{
    getNbaQuestions();
    categoryDiv.classList.add('nba');
    categoryDiv.classList.add("fade");
});

nflBtn.addEventListener("click",async(e)=>{
    getNflQuestions();
    categoryDiv.classList.add('nfl');
    categoryDiv.classList.add('fade');
    
});

boxingBtn.addEventListener("click", async(e)=>{
    getBoxingQuestions();
    categoryDiv.classList.add('boxing');
    categoryDiv.classList.add('fade');
});

/*
document.addEventListener("click", async (e) => {
    const resultsDiv = document.querySelector("#results-div");

    const button = e.target.closest(".submitAns");
    if (!button) return;

    const container = button.closest(".question-container");

    const correctAnswer = container.querySelector(".correctAns");
    const question = container.querySelector(".questionHeader");
    const input = container.querySelector('input[type="radio"]:checked');

    if (!input) {
        alert("Please select an answer!");
        return;
    }

    const correct = correctAnswer.textContent.trim();
    const selected = input.value.trim();
    const questionText = question.textContent.trim();

    console.log("Question:", questionText);
    console.log("Selected:", selected);
    console.log("Correct:", correct);

    if (selected === correct) {

        console.log("Correct answer detected!");

        await sendToCorrect(
            questionText,
            correct,
            selected
        );

    } else {
        await sendToWrong(
            questionText,
            correct,
            selected

        )
        console.log("Wrong answer!");

    }
    getCorrectAnswers();
    getWrongAnswers();

    answeredQuestion+=1;

    console.log(answeredQuestion);
   
}); */

async function getCorrectAnswers() {
    try {
        const response = await fetch('/get-correct-ans', {
            method: 'GET'
        });

        const data = await response.json();
        const answers = data.correctAnswers;
        console.log(answers);
        
    } catch (error) {
        console.log('Error: ', error);
    }

}

async function getResults() {
    try {
        const wrongResponse = await fetch('/get-wrong-ans', {
            method: 'GET'
        });

        const correctResponse = await fetch('/get-correct-ans', {
            method: 'GET'
        })


        const data = await wrongResponse.json();
        const correctData = await correctResponse.json();

        const answers = data.wrongAnswers;
        const resultsDiv = document.createElement('div');
        const correctAnswers = correctData.correctAnswers;

        const restartQuiz = document.createElement('button');
        restartQuiz.textContent = "Restart Quiz";
        restartQuiz.classList.add('restartQuiz');

        resultsDiv.innerHTML = 
        `
        <label style="font-size: 25px;"> Your Score: 
            <strong style="font-size: 23px;">${correctAnswers.length}</strong>
            <strong style="font-size: 18px;">out of</strong>
            <strong style="font-size: 23px;">${answeredQuestion}</strong>
        </label>

        <br>
        <br>
        <br>

        <label style="
        font-size: 20px;
        "> Correct Answers: </label> <br> <br>
        `



        answers.forEach(answer =>{
            const resultCard = document.createElement("div");
            resultCard.innerHTML = 
            `
            <label> ${answer.question} </label> 
            <br> 
            <label style="
            font-weight: lighter;
            color: lightgray;"> Your Answer:
                <strong> ${answer.userAnswer}</strong>
            <label>
            <br>
            <label style="
            font-weight: lighter;
            color: lightgray;">Correct Answer:
                <strong>${answer.correctanswer}</strong>
            <label> <br> <br>
            `
            resultsDiv.append(resultCard);
            resultsDiv.append(restartQuiz);
        });

        categoryDiv.innerHTML = resultsDiv.innerHTML;
        
    } catch (error) {
        console.log('Error: ', error);
    }

}

document.addEventListener("click" ,async(e)=>{
    const resetBtn = e.target.closest(".restartQuiz");
    if(!resetBtn) return;

    console.log("pozole");
    await restartQuiz();

    window.location.href = "/";
    



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

async function sendAnswer(question,answer) {
    try {
        const response = await fetch('/submit-item',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                user_choice: answer,
                question: question
            })
        });
        const data = await response.json();
        if(response.ok) {
            console.log("Success");
        } 
    }  catch (error){
        console.error('Error: ', error);
    }

}

async function restartQuiz() {
    try {
        const response = await fetch('/restart_quiz', {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        console.log('Quiz restarted!');
    } catch (error) {
        console.log('Error: ', error);
    }
}
async function sendToCorrect(question, correctAnswer, userAnswer) {
    console.log("sendToCorrect CALLED!");
   

    try {
        const response = await fetch('/to-correct-ans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_choice: userAnswer,
                question: question,
                correctAnswer: correctAnswer
            })
        });

        const data = await response.json();

        console.log("Response:", data);

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function sendToWrong(question, correctAnswer, userAnswer) {

    try {
        const response = await fetch('/to-wrong-ans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_choice: userAnswer,
                question: question,
                correctAnswer: correctAnswer
            })
        });
        const data = await response.json();
        if (data.success) {
            displayWrongAnswers(data.wrongAnswers);
        
    }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function displayWrongAnswers(wrongAnswers) {
    wrongAnswers.forEach((answer, index) => {
        const card = document.createElement("div");
        card.classList.add("wrong-answer-card");

        card.innerHTML = `
            <h3>Question ${index + 1}</h3>

            <p>
                <strong>Question:</strong>
                ${answer.question}
            </p>

            <p>
                <strong>Correct Answer:</strong>
                ${answer.correctanswer}
            </p>
            <br> 
            <br>

            <p>
                <strong>Your Answer:</strong>
                ${answer.userAnswer}
            </p>
        `;

        categoryDiv.innerHTML == card.innerHTML;

    });
}



document.addEventListener("click", async(e)=> {
    const button = e.target.closest('.submitAnswer');
    if(!button) return;

    const container = document.getElementById('categoryDiv');
    const input = container.querySelector('input[type="radio"]:checked');
    const question = container.querySelector(".questionHeader");
    const correctAnswer = container.querySelector(".correctAns");


    if(input.value === correctAnswer.value) {
        sendToCorrect(question.innerHTML, correctAnswer.value, input.value);
    } else {
        sendToWrong(question.innerHTML, correctAnswer.value, input.value);
    }

    
    categoryDiv.classList.remove("fade");
    void categoryDiv.offsetWidth;
    categoryDiv.classList.add("fade");

    getNbaQuestions();
    
    answeredQuestion++;

    if(answeredQuestion === 5) {
        getResults();
    }
    console.log(answeredQuestion);
});

document.addEventListener("click", async(e)=> {
    const button = e.target.closest('.submitNflButton');
    if(!button) return;

    const container = document.getElementById('categoryDiv');
    const input = container.querySelector('input[type="radio"]:checked');
    const question = container.querySelector(".questionHeader");
    const correctAnswer = container.querySelector(".correctAns");


    if(input.value === correctAnswer.value) {
        sendToCorrect(question.innerHTML, correctAnswer.value, input.value);
    } else {
        sendToWrong(question.innerHTML, correctAnswer.value, input.value);
    }

    
    categoryDiv.classList.remove("fade");
    void categoryDiv.offsetWidth;
    categoryDiv.classList.add("fade");

    getNflQuestions();
    
    answeredQuestion++;

    if(answeredQuestion === 5) {
        getResults();
    }
    console.log(answeredQuestion);
});


document.addEventListener("click", async(e)=> {
    const button = e.target.closest('.boxingButton');
    if(!button) return;

    const container = document.getElementById('categoryDiv');
    const input = container.querySelector('input[type="radio"]:checked');
    const question = container.querySelector(".questionHeader");
    const correctAnswer = container.querySelector(".correctAns");


    if(input.value === correctAnswer.value) {
        sendToCorrect(question.innerHTML, correctAnswer.value, input.value);
    } else {
        sendToWrong(question.innerHTML, correctAnswer.value, input.value);
    }

    
    categoryDiv.classList.remove("fade");
    void categoryDiv.offsetWidth;
    categoryDiv.classList.add("fade");

    getBoxingQuestions();
    
    answeredQuestion++;

    if(answeredQuestion === 5) {
        getResults();
    }
    console.log(answeredQuestion);
});

async function getNbaQuestions() {
    categoryDiv.innerHTML = '';
    try {
        const response = await fetch('/get-nba-questions', {
            method: 'GET'
        });

        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        } else {
            const data = await response.json();
            const newDiv = document.createElement('div');
            newDiv.classList.add('nba-container')
           

            const submitAnswer = document.createElement('button');
            submitAnswer.classList.add('submitAnswer');
            submitAnswer.textContent = "Submit";
            
            const h2 = document.createElement('h2');
            h2.innerText = data.nba_questions.question;
            h2.classList.add('questionHeader');

            const correctAnswer = document.createElement('input');
            correctAnswer.classList.add('correctAns');
            correctAnswer.value = data.nba_questions.answer;
            correctAnswer.type = 'hidden';


            newDiv.appendChild(h2);
            newDiv.appendChild(correctAnswer);

            const radioDiv = document.createElement('div');
            radioDiv.classList.add('radioDiv');

            for (const choice of data.nba_questions.choices) {
                const radioLabel = document.createElement('label');
                const radioElem = document.createElement('input');
                
                radioElem.type = 'radio';
                radioElem.name = 'nba-question';
                radioElem.classList.add('userChoice');
                radioElem.value = choice;

                
            
                radioLabel.appendChild(radioElem);
                radioLabel.appendChild(document.createTextNode(choice));
            
                
                radioDiv.appendChild(radioLabel);
            }
           
            newDiv.appendChild(radioDiv); 
            newDiv.appendChild(submitAnswer);
               
            categoryDiv.innerHTML = newDiv.innerHTML;
        }
    } 
    catch (error) {
        console.log('Error: ' + error);
    }
}

async function getNflQuestions() {
    categoryDiv.innerHTML = '';
    try {
        const response = await fetch('/get-nfl-questions', {
            method: 'GET'
        });

        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        } else {
            const data = await response.json();
            const newDiv = document.createElement('div');
            newDiv.classList.add('nfl-container')
           

            const submitAnswer = document.createElement('button');
            submitAnswer.classList.add('submitNflButton');
            submitAnswer.textContent = "Submit";
            
            const h2 = document.createElement('h2');
            h2.innerText = data.nfl_questions.question;
            h2.classList.add('questionHeader');

            const correctAnswer = document.createElement('input');
            correctAnswer.classList.add('correctAns');
            correctAnswer.value = data.nfl_questions.answer;
            correctAnswer.type = 'hidden';


            newDiv.appendChild(h2);
            newDiv.appendChild(correctAnswer);

            const radioDiv = document.createElement('div');
            radioDiv.classList.add('radioDiv');

            for (const choice of data.nfl_questions.choices) {
                const radioLabel = document.createElement('label');
                const radioElem = document.createElement('input');
                
                radioElem.type = 'radio';
                radioElem.name = 'nfl-question';
                radioElem.classList.add('userChoice');
                radioElem.value = choice;

                
            
                radioLabel.appendChild(radioElem);
                radioLabel.appendChild(document.createTextNode(choice));
            
                
                radioDiv.appendChild(radioLabel);
            }
           
            newDiv.appendChild(radioDiv); 
            newDiv.appendChild(submitAnswer);
               
            categoryDiv.innerHTML = newDiv.innerHTML;
        }
    } 
    catch (error) {
        console.log('Error: ' + error);
    }
}

async function getBoxingQuestions() {
    categoryDiv.innerHTML = '';
    try {
        const response = await fetch('/get-boxing-questions', {
            method: 'GET'
        });

        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        } else {
            const data = await response.json();
            const newDiv = document.createElement('div');
            newDiv.classList.add('boxing-container')
           

            const submitAnswer = document.createElement('button');
            submitAnswer.classList.add('boxingButton');
            submitAnswer.textContent = "Submit";
            
            const h2 = document.createElement('h2');
            h2.innerText = data.boxing_questions.question;
            h2.classList.add('questionHeader');

            const correctAnswer = document.createElement('input');
            correctAnswer.classList.add('correctAns');
            correctAnswer.value = data.boxing_questions.answer;
            correctAnswer.type = 'hidden';


            newDiv.appendChild(h2);
            newDiv.appendChild(correctAnswer);

            const radioDiv = document.createElement('div');
            radioDiv.classList.add('radioDiv');

            for (const choice of data.boxing_questions.choices) {
                const radioLabel = document.createElement('label');
                const radioElem = document.createElement('input');
                
                radioElem.type = 'radio';
                radioElem.name = 'boxing-question';
                radioElem.classList.add('userChoice');
                radioElem.value = choice;

                
            
                radioLabel.appendChild(radioElem);
                radioLabel.appendChild(document.createTextNode(choice));
            
                
                radioDiv.appendChild(radioLabel);
            } 
           
            newDiv.appendChild(radioDiv); 
            newDiv.appendChild(submitAnswer);
               
            categoryDiv.innerHTML = newDiv.innerHTML;
        }
    } 
    catch (error) {
        console.log('Error: ' + error);
    }
}
