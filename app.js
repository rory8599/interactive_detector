//this is the primary file and controls everything - it needs to load the other files (at least indirectly)

//Game object initialiser
var game = {

    level:
    {
        main: {
            displayValue: 1,
        },
        sub: {
            displayValue: 1,
        }
    },
    wrong: {
        displayValue: 0,
    },
    question: null,

    input:{      
        displayValue: null,
    }
    
};


//Buttons - handles the inputs
const buttons = document.querySelectorAll('.inputbuttons');
//buttons.forEach(button => button.addEventListener('click', handleButtons(button)));

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
};

function handleSubmit() {
    //maybe it doesn't like changing the variable like this??
    let userInput = game.input.displayValue;
    compareUserInput(userInput);
    game.input.displayValue = "";
    //game.question = randomGenerate(game.main.level)
};

function handleRestart() {
    game.input.displayValue = "";
    game.level.main.displayValue = 1;
        updateMainLevel();
    game.level.sub.displayValue = 1;
        updateSubLevel();
    game.wrong.displayValue = 0;
        updateWrong();
    game.question = randomGenerate(1);
};

function updateDisplay() {
    let display = document.getElementById('userParticle');
    display.value = game.input.displayValue;
};

//Level and wrong displays - functions to update them
function updateMainLevel() {
    let main = document.getElementById('app_level_main');
    main.value = game.level.main.displayValue;
};

function updateSubLevel() {
    let sub = document.getElementById('app_level_sub');
    sub.value = game.level.sub.displayValue;
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
    //probably needs some logic here so that nothing shows if wrong > 5
    game.question = rand.toString(5);
    //let question = game.question;
    genNumber();
    //detector.handleQuestion();
};


function genNumber() {
    let randomNum = document.getElementById('randomNum')
    let index, time;
    index = game.level.main.displayValue;
    time = 100*Math.min((index + 2), 5) + 400*Math.max((index - 5), 0);

    randomNum.innerHTML = game.question;

    setTimeout(
        function(){
            randomNum.innerHTML = randomNum.innerHTML.replace(/\w|\W/gi, '&#183;');
        },
        time);
};




function compareUserInput(userInput) {
    //game.level.main = document.getElementById('app_level_main');
    //game.wrong = document.getElementById('app_wrong_number')
    
    //let mainLevel = game.level.main.displayValue,
    //  subLevel = game.level.sub.displayValue,
    //  wrong = game.wrong.displayValue,
    let question = game.question;
    
    if(userInput == question){
        if(game.level.sub.displayValue < 5){
            game.level.sub.displayValue = ++ game.level.sub.displayValue;
            updateSubLevel();
        }
        else if(game.level.sub.displayValue == 5){
            game.level.main.displayValue = ++ game.level.main.displayValue;
            game.level.sub.displayValue = 1;
            updateMainLevel();
            updateSubLevel();
        }
    }
    else{
        game.wrong.displayValue = ++ game.wrong.displayValue;
        updateWrong();
    }

    //equivalent of set state to new values
    //game.level.main = mainLevel;
    //game.level.sub = subLevel;
    //game.wrong = wrong;
    randomGenerate(game.level.main.displayValue);

};


(function(){
    game.question = randomGenerate(1);

})();