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
    question: "",

    allQuestions: "",

    input:{      
        displayValue: "",
    }
    
};

//Handle start
document.getElementById('start').addEventListener("click", function(){
    document.getElementById('start').style.visibility = 'hidden';
    var coreCanvas = document.getElementById('detector_core')
    //coreCanvas.hidden = false;
    document.getElementById('detector_events').hidden = false;
    coreCanvas.addEventListener("load", randomGenerate(1));
}, false);


//Buttons - handles the inputs
const buttons = document.querySelectorAll('.inputbuttons');

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
    let userInput = game.input.displayValue;
    compareUserInput(userInput);
    game.input.displayValue = "";
    document.getElementById('userParticle').value = "";
    detector.clearTracks();
};

function handleRestart() {
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
        updateMainLevel();
    game.level.sub.displayValue = 1;
        updateSubLevel();
    game.wrong.displayValue = 0;
        updateWrong();
    randomGenerate(1);
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
    game.question = rand.toString(5);
    detector.handleQuestion();

};


function compareUserInput(userInput) {

    let question = game.question;
    let allParticles = game.allQuestions;
    game.allQuestions = allParticles.concat(question);
    let userInputArray = userInput.split("").sort();
    let questionArray = question.split("").sort();
    let numberWrong = 0; 
    var wrongArray = [];
//in order to show correct number os particle sidentified we need to keep track of number wrong
//either discount all particles as wrong if there is no match or try and give a point for those right
    function checkForMatch(userInputArray, questionArray) {
        if(userInputArray.length < questionArray.length)
            {numberWrong += questionArray.length - userInputArray.length};
        
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
        game.wrong.displayValue += numberWrong;
        updateWrong();
    }

    if(game.wrong.displayValue < 5){
        randomGenerate(game.level.main.displayValue);
    }
    else{
        endGame(questionArray, wrongArray);
    }

};

(function mouseOver(){

    var onObject = 0;

    var infoSi = document.getElementById('sitr_info');
    var infoEcal = document.getElementById('ecal_info');
    var infoHcal = document.getElementById('hcal_info');
    var infoMag = document.getElementById('magnet_info');
    var infoMu = document.getElementById('muontr_info');

    let coreCanvas = detector.events.canvas
    //let ctx = detector.events.ctx
    var cx = detector.width/2
    var cy = detector.height/2

    //const infoOpen = false;

    //Function to highlight info when over subdetectors
    coreCanvas.addEventListener('click', function(e){
        if(Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) < detector.radius.silicon){
            onObject = 1;
        }
        else if((Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) < detector.radius.ecal)&
        Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) > detector.radius.siliconSpace){
            onObject = 2;
        }
        else if((Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) < detector.radius.hcal)&
        Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) > detector.radius.ecalSpace){
            onObject = 3;
        }
        else if((Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) < detector.radius.magnet)&
        Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) > detector.radius.hcalSpace){
            onObject = 4
        }
        else if((Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) < detector.radius.muon)&
        Math.sqrt((e.offsetX - cx)*(e.offsetX - cx) + (e.offsetY - cy)*(e.offsetY - cy)) > detector.radius.magnetSpace){
            onObject = 5
        }
        else{
            onObject = 0;
        }
        resetInfo()
        highlightInfo(onObject);
    }, false)


    function highlightInfo(onObject) {
        switch(onObject){
            case 0:
                resetInfo();
                break;
            case 1:
                infoSi.style.backgroundColor = 'rgb(220,220, 235)';
                infoSi.style.display === "block";
                break;
            case 2:
                infoEcal.style.backgroundColor = 'rgb(220,220, 235)';
                infoEcal.style.display === "block";
                break;
            case 3:
                infoHcal.style.backgroundColor = 'rgb(220,220, 235)';
                infoHcal.style.display === "block";
                break;
            case 4:
                infoMag.style.backgroundColor = 'rgb(220,220, 235)';
                infoMag.style.display === "block";
                break;
            case 5:
                infoMu.style.backgroundColor = 'rgb(220,220,235';
                infoMu.style.display === "block";
                break;
        }
    };
    function resetInfo(){
        infoSi.style.backgroundColor = 'rgb(248,248,255)';
        infoEcal.style.backgroundColor = 'rgb(248,248,255)';
        infoHcal.style.backgroundColor = 'rgb(248,248,255)';
        infoMag.style.backgroundColor = 'rgb(248,248,255)';
        infoMu.style.backgroundColor = 'rgb(248,248,255)';
    }
    
})()

function openRules() {
    document.getElementById('subdet').style.width = '0px';
    document.getElementById('rules').style.width = '50%';
    //infoOpen = true;
}

function openInfo(){
    document.getElementById('rules').style.width = '0px';
    document.getElementById('subdet').style.width = '50%';
    //infoOpen = true;
}

function closeNav(){
    document.getElementById('rules').style.width = '0px';
    document.getElementById('subdet').style.width = '0px';
    //infoOpen = false;
}

var dropdown = document.getElementsByClassName("dropdown_btn");
var i;
for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } 
        else {
            dropdownContent.style.display = "block";
        }
    });
}


function endGame(missed, extra) {
    
    for(var i=0; i<buttons.length; i++){
        buttons[i].style.visibility = 'hidden';
    }

    document.querySelector('.userParticle').style.visibility = 'hidden';
    document.querySelector(".endgame").hidden = false;

    let m = game.level.main.displayValue;
        s = game.level.sub.displayValue;
    document.getElementById('correctParticles').innerHTML = (s-1) * m + 2.5 * m * (m-1);

    if(missed.length>0){
        document.getElementById('missedMessage').hidden = false;
        document.getElementById('missedParticles').innerHTML = numberToParticle(missed.map(Number));
    }
    if(extra.length>0){
        document.getElementById('extraMessage').hidden = false;
        document.getElementById('extraParticles').innerHTML = numberToParticle(extra.map(Number));
    }

    game.question = game.allQuestions;
    document.getElementById('showAllTracks').addEventListener("click", function(){
        detector.handleQuestion()}, false);
    document.getElementById('restart_end').addEventListener("click", function(){
        handleRestart()}, false);
}
