const questions = [
    {
        question: "What is HTML?",
        options: ["Programming Language", "Markup Language", "Database", "OS"],
        correct: 1
    },
    {
        question: "Which is used for styling?",
        options: ["HTML", "Python", "CSS", "C++"],
        correct: 2
    },
    {
        question: "Which is used for logic?",
        options: ["JavaScript", "CSS", "SQL", "Photoshop"],
        correct: 0
    }


];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;

// Elements
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");
const questionNumber = document.getElementById("question-number");
const scoreText = document.getElementById("score-text");
const restartBtn = document.getElementById("restart-btn");

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

function startQuiz() {
    welcomeScreen.classList.add("hide");
    quizScreen.classList.remove("hide");
    loadQuestion();
}

function loadQuestion() {
    resetState();
    let q = questions[currentQuestion];
    questionText.innerText = q.question;
    questionNumber.innerText = `Q ${currentQuestion + 1} of ${questions.length}`;

    q.options.forEach((option, index) => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.classList.add("option-btn");
        btn.addEventListener("click", () => selectOption(btn, index));
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function selectOption(button, index) {
    clearInterval(timer);
    let correctIndex = questions[currentQuestion].correct;
    let buttons = document.querySelectorAll(".option-btn");

    buttons.forEach(btn => btn.disabled = true);

    if (index === correctIndex) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        buttons[correctIndex].classList.add("correct");
    }

    nextBtn.classList.remove("hide");
}

function startTimer() {
    timeLeft = 10;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            autoMove();
        }
    }, 1000);
}

function autoMove() {
    let correctIndex = questions[currentQuestion].correct;
    let buttons = document.querySelectorAll(".option-btn");
    buttons[correctIndex].classList.add("correct");
    buttons.forEach(btn => btn.disabled = true);
    nextBtn.classList.remove("hide");
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizScreen.classList.add("hide");
    resultScreen.classList.remove("hide");
    scoreText.innerText = `You scored ${score} / ${questions.length}`;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    resultScreen.classList.add("hide");
    welcomeScreen.classList.remove("hide");
}

function resetState() {
    clearInterval(timer);
    nextBtn.classList.add("hide");
    optionsContainer.innerHTML = "";
}