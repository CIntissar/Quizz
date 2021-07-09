let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);
let backgroundImage;
let answerImage = [];
let answerText = [];
let answerNumber = 3;
let questionImage;
let playButtonImage;
let currentQuestionIndex = 0;
let score = 0;
let starImage = [];
let goodAnswerSound, wrongAnswerSound;
let welcomeImage, quizText, welcomeText, menuImage, restartImage;

let quizzString ; // = '{ "questions": [ { "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", "answers": ["Lenine", "Staline", "Molotov"], "goodAnswerIndex" : 1 }, {"title": "Ma deuxième question", "answers": ["Réponse 0", "Réponse 1", "Réponse 2"],"goodAnswerIndex" : 0}]}';
let quizz; // = JSON.parse(quizzString);

/*
let quizz = { "questions": [ 
    { 
        "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", 
        "answers": [
            "Lenine", 
            "Staline", 
            "Molotov"], 
        "goodAnswerIndex" : 1 }, 
    {
        "title": "Ma deuxième question", 
        "answers": [
            "Réponse 0", 
            "Réponse 1", 
            "Réponse 2"],
            "goodAnswerIndex" : 0}
        ]
    };
*/

function preload() {
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('labelquestion', './assets/Sprites/label1.png');
    this.load.image('labelanswer', './assets/Sprites/label2.png');
    this.load.image('playButton', './assets/Sprites/Play.png');
    this.load.image('starImage', './assets/Sprites/Star.png');
    this.load.image('welcome', './assets/Sprites/Windows3.png');
    this.load.image('menu', './assets/Sprites/Menu.png');
    this.load.image('restart', './assets/Sprites/Restart.png');
    // Load JSON File
    this.load.json('questions', './assets/data/MyQuestions.json');
    // Load Font 
    loadFont("carterone", "./assets/Fonts/CarterOne.ttf");
    loadFont("skranji", "./assets/Fonts/Skranji-Bold.ttf");
}

function create() {
    quizz = this.cache.json.get('questions');
    backgroundImage = this.add.image(0, 0, 'background'); 
    backgroundImage.setOrigin(0, 0); 
    backgroundImage.setScale(0.5);
    // build welcome screen
    welcomeImage = this.add.image(300, 250, 'welcome');
    welcomeImage.setScale(0.7);
    quizText = this.add.text(220, 105, "Personality Test", { fontFamily: 'skranji', fontSize: 20, color: '#000000' });
    welcomeText = this.add.text(135, 200, "Press the button to start the test!", { fontFamily: 'carterone', fontSize: 20, color: '#000000' });
    menuImage = this.add.image(300, 300, 'menu').setInteractive();
    menuImage.setScale(0.5);
    menuImage.on('pointerdown', displayGameScreen);

    restartImage = this.add.image(300, 300, 'restart').setInteractive();
    restartImage.setScale(0.5);
    restartImage.on('pointerdown', restartGame);
    restartImage.setVisible(false);

    // build game screen
    questionImage = this.add.image(300, 110, 'labelquestion');
    questionImage.setScale(0.8);
    questionImage.setVisible(false);
    for(let i=0; i<answerNumber; i++) {
        answerImage[i] = this.add.image(300, 230 + i*110 , 'labelanswer').setInteractive();
        answerImage[i].on('pointerdown',  () => {checkAnswer(i)});
        answerImage[i].setScale(1.5,1.0);
        answerImage[i].setVisible(false);
    }
    questionText = this.add.text(65, 65, quizz.questions[0].title, { fontFamily: 'skranji', fontSize: 18, color: '#00ff00' });
    questionText.setVisible(false);
    for(let i=0; i<answerNumber; i++) {
        answerText[i] = this.add.text(120, 210+i*110, quizz.questions[0].answers[i], { fontFamily: 'carterone', fontSize: 18, color: '#000000' });
        answerText[i].setVisible(false);
    }
    playButtonImage = this.add.image(300, 530, 'playButton').setInteractive();
    playButtonImage.on('pointerdown', displayNextQuestion);
    playButtonImage.setScale(0.3);
    playButtonImage.setVisible(false);
    
}

function update() {

}

function checkAnswer(answerIndex){
    if (answerIndex == 0) score++ ;    // réponse a -> 1 points
    //if (answerIndex == 1) ; score==0; réponse b -> 0 points
    if (answerIndex == 2) ; score+=2;  // réponse c -> 2 points

    
    
    playButtonImage.setVisible(true);
    for(let i=0; i<3; i++) {
        answerImage[i].disableInteractive();
        if (i== answerIndex) answerText[i].setColor('#00ff00');
        
    }
}

function displayNextQuestion(){
    currentQuestionIndex ++;
    if(currentQuestionIndex>30){
        displayGameOver();
    }
    else{
        questionText.text = quizz.questions[currentQuestionIndex].title;
        for(let i=0; i<3; i++) {
            answerText[i].text = quizz.questions[currentQuestionIndex].answers[i];
            answerText[i].setColor("#000000");
        }
        playButtonImage.setVisible(false);
        for(let i=0; i<3; i++) answerImage[i].setInteractive();
    }
}

function displayGameScreen(){
    welcomeImage.setVisible(false);
    quizText.setVisible(false);
    welcomeText.setVisible(false);
    menuImage.setVisible(false);

    questionImage.setVisible(true);
    questionText.setVisible(true);
    for(let i=0; i<3; i++){
        answerImage[i].setVisible(true);
        answerText[i].setVisible(true);
    }
    
}

function displayGameOver() {
    welcomeImage.setVisible(true);
    quizText.setVisible(true);
    welcomeText.setVisible(true);
    if(score>15) welcomeText.text = "Plus de 15 points";
    else if(score>10) welcomeText.text = "Entre 10 à 15 points";
    else welcomeText.text = "En dessous de 10 points";

    restartImage.setVisible(true);

    playButtonImage.setVisible(false);
    questionImage.setVisible(false);
    questionText.setVisible(false);
    for(let i=0; i<3; i++){
        answerImage[i].setVisible(false);
        answerText[i].setVisible(false);
    }
}

function restartGame(){
    currentQuestionIndex = -1;
    displayNextQuestion();
    restartImage.setVisible(false);
    displayGameScreen();
    score=0;
}

function loadFont(name, url) { 
    var newFont = new FontFace(name, `url(${url})`); 
    newFont.load().then(function (loaded) { 
    document.fonts.add(loaded); 
    }).catch(function (error) { 
    return error; 
    }); 
} 
/*

- quizz
    - question []
        -title (string)
        -answer [] (string)
        -goodAnswerIndex (int)

Implémentation dans :
    - une Base de données
    - CSV
    - XML
    - JSON
    - YAML

XML :
    <quizz>
        <question>
            <title>la première question ?</title>
            <answer i="0"> Réponse 0</answer>
            <answer i="1"> Réponse 1</answer>
            <answer i="2"> Réponse 2</answer>
            <goodAnswerIndex>1</goodAnswerIndex>
        </question>
    </quizz>

YAML :
    quizz :
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 1
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 0

JSON :
    {
        "questions":[
            {
                "title": "Ma premère question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 1
            },
            {
                "title": "Ma deuxième question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 0
            }
        ]
    }

    */