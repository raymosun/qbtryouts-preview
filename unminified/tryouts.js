const status = document.querySelector('.status');
const question = document.querySelector('.question');
const loadingBar = document.querySelector('.loading-bar');
const mainTime = document.querySelector('.main-time');
const deciseconds = document.querySelector('.deciseconds');
const form = document.querySelector('form');
const confirmations = document.querySelector('.confirmations');
const userinfo = document.querySelector('.userinfo');
const answer = document.querySelector('input');
const skip = document.querySelector('.skip');

const questions = [
    "Who was the first president of the United States?",
    "Who painted the Mona Lisa?",
    "What organelle is considered the powerhouse of the cell?"
]

form.addEventListener('submit', event => {
    event.preventDefault();
});

let skipping = false;

startTryouts();

async function startTryouts(){
    status.innerHTML = 'starting soon...'
    updateTimer(30000, runTryouts);
}

async function runTryouts(){
    hideSkip();
    await sleep(200);

    for(var i = 0; i < questions.length; i++){
        status.innerHTML = `in progress (${i+1}/3)`;
        await askQuestion(questions[i]);
    }
    while(questions.length > 0){
        const q = questions.shift();
        
    }
    questions.forEach( async q => { await askQuestion(q); });

    status.innerHTML = 'finished. thanks for trying out!'
}

function sleep(ms){
    return new Promise(res => { setTimeout(res, ms); });
}

async function updateTimer(duration,endFunction,countUp=false,startTime=Date.now(),currentTime=startTime){
    if (skipping){
        skipping = false;
        return endFunction();
    }
    const timeLeft = Math.max(duration-(currentTime-startTime), 0);

    var minutes = Math.floor(timeLeft/1000/60);
    var seconds = Math.floor(timeLeft/1000)%60;
    const decisecondsVal = Math.floor(timeLeft%1000 / 100);
    if (seconds < 10) seconds = '0'+seconds;
    if (minutes < 10) minutes = '0'+minutes;

    mainTime.innerHTML = `${minutes}:${seconds}`;
    deciseconds.innerHTML = `.${decisecondsVal}`;

    if (countUp) widthPercent = Math.min(100-((timeLeft-100)/duration*100), 100);
    else widthPercent = Math.max((timeLeft-100)/duration*100,0);

    const widthString = widthPercent+'%';
    loadingBar.style.width = widthString;

    if (timeLeft === 0) return endFunction();

    const inaccuracy = Date.now()-currentTime;
    setTimeout(updateTimer,100-inaccuracy,duration,endFunction,countUp,startTime,currentTime+100)
}

async function askQuestion(questionText){
    loadingBar.style.backgroundColor = "#555555";
    question.innerHTML = '<span class="noquestion"><em>question incoming</em></span>';
    updateTimer(3000, function(){}, true);
    await sleep(3200);

    question.innerHTML = '&#8203';
    loadingBar.style.backgroundColor = "#1abd40";
    enableAnswer();
    await sleep(100);

    const words = questionText.split(' ');
    while(words.length > 0){
        const word = words.shift();
        question.innerHTML += `<span>${word} </span>`;
        await sleep(300);
    }

    updateTimer(8000, function(){})
    await sleep(8000);

    question.innerHTML = '<span class="noquestion"><em>question</em></span>';
    showConfirmation({
        answer: answer.value,
        question: questionText
    });
    disableAnswer();
    await sleep(1000);
}

function enableAnswer(){
    answer.disabled = false;
    answer.focus();
}

function disableAnswer(){
    answer.disabled = true;
    answer.value = '';
}

function showConfirmation(confirmation){
    var message = document.createElement('P');
    var userAnswer = document.createElement('SPAN');
    userAnswer.classList.add('answer');
    var ending = document.createElement('SPAN');
    
    if(!confirmation.answer) confirmation.answer = '[no answer]';
    userAnswer.textContent = confirmation.answer;
    ending.innerHTML = ` to <em>${confirmation.question}</em>`;

    message.innerHTML = 'Answered ';
    message.append(userAnswer)
    message.append(ending);
    confirmations.prepend(message);
}

function skipTimer(){
    updateTimer(0, function(){});
    skipping = true;
}

function hideSkip(){
    skip.disabled = true;
    skip.style.opacity = 0;
    skip.style.visibility = 'hidden';
}