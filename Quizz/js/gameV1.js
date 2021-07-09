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
    this.load.image('background', './assets/New_Sprites/background.png');
    this.load.image('labelquestion', './assets/New_Sprites/Label1.png');
    this.load.image('labelanswer', './assets/New_Sprites/Label2.png');
    this.load.image('playButton', './assets/New_Sprites/Play.png');
    this.load.image('starImage', './assets/New_Sprites/Star.png');
    this.load.image('welcome', './assets/New_Sprites/Windows3.png');
    this.load.image('menu', './assets/New_Sprites/Menu.png');
    this.load.image('restart', './assets/New_Sprites/Restart.png');
    // Load JSON File
    this.load.json('questions', './assets/data/Questions.json');
    // Load sounds
    this.load.audio('goodSound', './assets/Sound/good.wav');
    this.load.audio('wrongSound', './assets/Sound/wrong.wav');
    // pour charger une font

    loadFont("carterone", "./assets/Fonts/CarterOne.ttf");
    loadFont("skranji", "./assets/Fonts/Sktanji-Bold.ttf");
    loadFont("dark", "./assets/Fonts/Dark_Mage.ttf");
    loadFont("jason", "./assets/Fonts/Friday13v12.ttf");
    loadFont("dhf", "./assets/Fonts/DHF_Story_Brush.ttf");
}

function create() {
    
    quizz = this.cache.json.get('questions');
    backgroundImage = this.add.image(0, 0, 'background'); 
    backgroundImage.setOrigin(0, 0); 
    backgroundImage.setScale(0.5);
    // build welcome screen
    welcomeImage = this.add.image(300, 250, 'welcome');
    welcomeImage.setScale(0.7);
    quizText = this.add.text(250, 95, "QUIZZ", { fontFamily: "dark", fontSize: 36, color: '#ff0000' });
    welcomeText = this.add.text(135, 210, "Press the button to start,...if you dare...", { fontFamily: 'jason', fontSize: 20, color: '#d42020', align:'center'});
    
    menuImage = this.add.image(300, 315, 'menu').setInteractive();
    menuImage.setScale(0.5);
    menuImage.on('pointerdown', displayGameScreen);

    restartImage = this.add.image(300, 315, 'restart').setInteractive();
    restartImage.setScale(0.5);
    restartImage.on('pointerdown', restartGame);
    restartImage.setVisible(false);

    // build game screen
    questionImage = this.add.image(300, 100, 'labelquestion');
    questionImage.setScale(0.5);
    questionImage.setVisible(false);
    for(let i=0; i< quizz.questions[0].answers.length; i++) { // 
        answerImage[i] = this.add.image(300, 220 + i*110 , 'labelanswer').setInteractive();
        answerImage[i].on('pointerdown',  () => {checkAnswer(i)});
        answerImage[i].setScale(1.0);
        answerImage[i].setVisible(false);
    }
    questionText = this.add.text(155, 75, quizz.questions[0].title, { fontFamily: 'dhf', fontSize: 18, color: '#000000' });
    questionText.setVisible(false);
    for(let i=0; i<answerNumber; i++) {
        answerText[i] = this.add.text(190, 210+i*110, quizz.questions[0].answers[i], { fontFamily: 'jason', fontSize: 18, color: '#d42020' });
        answerText[i].setVisible(false);
    }
    playButtonImage = this.add.image(300, 530, 'playButton').setInteractive();
    playButtonImage.on('pointerdown', displayNextQuestion);
    playButtonImage.setScale(0.3);
    playButtonImage.setVisible(false);
    for(let i=0; i<quizz.questions.length; i++){
        starImage[i] = this.add.image(50+i*55, 600, 'starImage');
        starImage[i].setScale(0.2);
        starImage[i].alpha = 0;
    }
    goodAnswerSound = this.sound.add('goodSound');
    wrongAnswerSound = this.sound.add('wrongSound');
}

function update() {

}

function checkAnswer(answerIndex){
    if (answerIndex==quizz.questions[currentQuestionIndex].goodAnswerIndex) {
        goodAnswerSound.play();
        score++;
        starImage[currentQuestionIndex].alpha=1;
    }
    else {
        wrongAnswerSound.play();
        starImage[currentQuestionIndex].tint = 0xff0000;
    }
    playButtonImage.setVisible(true);
    for(let i=0; i<quizz.questions[0].answers.length; i++) {
        answerImage[i].disableInteractive();
        if (i==quizz.questions[currentQuestionIndex].goodAnswerIndex) answerText[i].setColor('#00ff00');
        else answerText[i].setColor('#ff0000');
    }
}

function displayNextQuestion(){
    currentQuestionIndex ++;
    if(currentQuestionIndex>9){
        displayGameOver();
    }
    else{
        questionText.text = quizz.questions[currentQuestionIndex].title;
        for(let i=0; i<quizz.questions[0].answers.length; i++) {
            answerText[i].text = quizz.questions[currentQuestionIndex].answers[i];
            answerText[i].setColor("#000000");
        }
        playButtonImage.setVisible(false);
        for(let i=0; i<quizz.questions[0].answers.length; i++) answerImage[i].setInteractive();
    }
}

function displayGameScreen(){
    welcomeImage.setVisible(false);
    quizText.setVisible(false);
    welcomeText.setVisible(false);
    menuImage.setVisible(false);

    questionImage.setVisible(true);
    questionText.setVisible(true);
    for(let i=0; i<quizz.questions[0].answers.length; i++){
        answerImage[i].setVisible(true);
        answerText[i].setVisible(true);
    }
    for(let i=0; i<quizz.questions.length; i++){
        starImage[i].alpha = 0.5;
        starImage[i].tint = 0xffffff;
    }
}

function displayGameOver() {
    welcomeImage.setVisible(true);
    quizText.setVisible(true);
    welcomeText.setVisible(true);
    welcomeText.text = "Your score is " + score + "/10\nPress the button to restart";
    restartImage.setVisible(true);

    playButtonImage.setVisible(false);
    questionImage.setVisible(false);
    questionText.setVisible(false);
    for(let i=0; i<quizz.questions[0].answers.length; i++){
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

// Fonction pour une font!!!
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