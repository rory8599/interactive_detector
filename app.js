var game = {

    difficulty: 0,

    level:
    {
        main: {
            displayValue: 1,
        },
        sub: {
            displayValue: 1,
        }
    },
    correct: {
        displayValue: 0,
    },
    wrong: {
        displayValue: 0,
    },
    question: "",

    allQuestions: "",

    input:{      
        displayValue: "",
    }
    
};
const buttons = document.querySelectorAll('.inputbuttons');

//Handle start
document.getElementById('start').addEventListener("click", function(){
    document.getElementById('startPopup').style.visibility = 'hidden';
    document.getElementById('detector_events').hidden = false;
    for(var i=0; i<buttons.length; i++){
        buttons[i].disabled = false;
        console.log(buttons[i].disabled)
    }
    randomGenerate(1);
}, false);

//Handles the buttons setting the difficulty
const diffButtons = document.querySelectorAll('.difficultyButtons');
for(var i = 0; i<diffButtons.length; i++){
    diffButtons[i].addEventListener("click",function(event){
        game.difficulty = event.target.value
        for(var j = 0; j<diffButtons.length; j++){
            diffButtons[j].className = diffButtons[j].className.replace(" active", "");
        }
        diffButtons[event.target.value].className += " active";
    },false);
}

//Buttons - handles the inputs
for(var i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click", event => handleButtons(event))
}

function handleButtons(event) {   
    if (!event.target.matches('button')) {
        return;
    }
    switch (event.target.value) {
        case 'clear':
            handleClear();
            break;
        case 'submit':
            handleSubmit();
            break;
        case 'restart':
            handleRestart();
            break;
        default:
            inputDigit(event.target.value);
    }
    updateDisplay();
};

function inputDigit(digit) {
    game.input.displayValue = game.input.displayValue === null? digit : game.input.displayValue + digit;
};

function handleClear() {
    game.input.displayValue = "";
    document.getElementById('userParticle').value = "";
};

function handleSubmit() {
    detector.events.submitted = true;
    let userInput = game.input.displayValue;
    compareUserInput(userInput);
    game.input.displayValue = "";
    document.getElementById('userParticle').value = "";
};

function handleRestart() {
    detector.events.submitted = true;
    game.allQuestions = "";
    game.input.displayValue = "";
    for(var i=0; i<buttons.length; i++){
        buttons[i].style.visibility = 'visible';
    }
    document.querySelector('.userParticle').style.visibility = 'visible';
    document.querySelector(".endgame").hidden = true;
    document.getElementById('extraMessage').hidden = true;
    document.getElementById('extraMessage').hidden = true;
    document.getElementById('userParticle').value = "";
    game.level.main.displayValue = 1;
    game.level.sub.displayValue = 1;
    game.correct.displayValue = 0;
        updateCorrect();
    game.wrong.displayValue = 0;
        updateWrong();
    document.getElementById('startPopup').style.visibility = 'visible';
};

function updateDisplay() {
    let display = document.getElementById('userParticle');
    let number = game.input.displayValue;
    let userInput = [];

    display.value = "";
    for(var i = 0; i < number.length; i++){
        userInput.push(+number.charAt(i));
    }
    display.value = numberToParticle(userInput)
    display.scrollTop = display.scrollHeight;
};

function numberToParticle(numberArray) {
    let particlesString = "";
    for(var i = 0; i < numberArray.length; i++){
        switch(numberArray[i]){
            case 0:
                particlesString += 'Photon \n';
                break;
            case 1:
                particlesString += 'Electron \n';
                break;
            case 2:
                particlesString += 'Muon \n';
                break;
            case 3:
                particlesString += 'Neutral Hadron \n';
                break;
            case 4:
                particlesString += 'Charged Hadron \n';
                break; 
        }
    }
    return particlesString
}

//Level and wrong displays - functions to update 
function updateCorrect() {
    let correct = document.getElementById('app_correct_number');
    correct.value = game.correct.displayValue;
};

function updateWrong() {
    let wrong = document.getElementById('app_wrong_number');
    wrong.value = game.wrong.displayValue;
};

//Generate random number - creates outputs
function randomGenerate(number) {    
    let max = Math.pow(5, number) - 1;
    let min = Math.pow(5, (number - 1));
    let rand = Math.floor(Math.random()*(max-min+1))+min;
    game.question = rand.toString(5);
    detector.handleQuestion();
};

function compareUserInput(userInput) {
    let question = game.question;
    let userInputArray = userInput.split("").sort();
    let questionArray = question.split("").sort();
    let numberWrong = 0; 
    let numberCorrect = 0;
    var wrongArray = [];

    function checkForMatch(userInputArray, questionArray) {
        if(userInputArray.length < questionArray.length) {
            numberWrong += questionArray.length - userInputArray.length
        };      
        for(var i = 0; i< userInputArray.length; i++) {
            var match = false;
            for(var j = 0; j < questionArray.length; j++) {
                if(userInputArray[i] == questionArray[j]){
                    match = true;
                    questionArray.splice(j,1);
                    break;
                }
            }                    
            if(!match){
                wrongArray.push(userInputArray[i]);
            }
        }
        numberCorrect += game.level.main.displayValue - questionArray.length;
        game.correct.displayValue += numberCorrect;
        updateCorrect();
        numberWrong += wrongArray.length;
        if(numberWrong>0){
            return false
        }
        return true;   
    };
    
    var correct = checkForMatch(userInputArray,questionArray)
    
    if(correct){
        if(game.level.sub.displayValue < 5){
            game.level.sub.displayValue = ++ game.level.sub.displayValue;
        }
        else if(game.level.sub.displayValue == 5){
            game.level.main.displayValue = ++ game.level.main.displayValue;
            game.level.sub.displayValue = 1;
        }
    }
    else{
        game.wrong.displayValue += numberWrong;
        updateWrong();
        var holder = document.getElementById('detector-holder');
        holder.style.setProperty('--animate-duration', '0.4s');
        holder.classList.add('animate__animated', 'animate__shakeX');
        holder.addEventListener('animationend', () => {
            holder.classList.remove('animate__animated', 'animate__shakeX');
        });
    }
    if(game.wrong.displayValue < 5){
        randomGenerate(game.level.main.displayValue);
    }
    else{
        for(var i=0; i<buttons.length; i++){
            buttons[i].disabled = true;
        }
        endGame(questionArray, wrongArray);
    }
};

function endGame(missed, extra) {
    
    for(var i=0; i<buttons.length; i++){
        buttons[i].style.visibility = 'hidden';
    }

    document.querySelector('.userParticle').style.visibility = 'hidden';
    document.querySelector(".endgame").hidden = false;

    document.getElementById('correctParticles').innerHTML = game.correct.displayValue;

    if(missed.length>0){
        document.getElementById('missedMessage').hidden = false;
        document.getElementById('missedParticles').innerHTML = numberToParticle(missed.map(Number));
    }
    if(extra.length>0){
        document.getElementById('extraMessage').hidden = false;
        document.getElementById('extraParticles').innerHTML = numberToParticle(extra.map(Number));
    }
    document.getElementById('restart_end').addEventListener("click", function(){
        handleRestart()}, false);
}
