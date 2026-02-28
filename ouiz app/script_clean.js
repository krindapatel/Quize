// quiz data
const questions = [
  {
    question: "Which tag defines client-side script?",
    options: ["<script>", "<style>", "<meta>", "<code>"],
    answer: 0
  },
  {
    question: "CSS stands for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets"],
    answer: 1
  },
  {
    question: "Which is a JavaScript framework?",
    options: ["Laravel", "React", "Django", "Flask"],
    answer: 1
  },
  {
    question: "Which attribute is used for image source?",
    options: ["href", "src", "alt", "link"],
    answer: 1
  },
  {
    question: "JavaScript is used for?",
    options: ["Styling", "Structure", "Interactivity", "Database"],
    answer: 2
  }
];

// state variables
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let currentUser = "";
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// DOM elements
const loginScreen = document.querySelector(".login-screen");
const startScreen = document.querySelector(".start-screen");
const quizScreen = document.querySelector(".quiz-screen");
const resultScreen = document.querySelector(".result-screen");

const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const questionNumber = document.getElementById("questionNumber");
const timerDisplay = document.getElementById("timer");

// event listeners
if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").onclick = login;
}
if (document.getElementById("startBtn")) {
  document.getElementById("startBtn").onclick = startQuiz;
}
if (document.getElementById("nextBtn")) {
  document.getElementById("nextBtn").onclick = nextQuestion;
}
if (document.getElementById("prevBtn")) {
  document.getElementById("prevBtn").onclick = prevQuestion;
}
if (document.getElementById("restartBtn")) {
  document.getElementById("restartBtn").onclick = restartQuiz;
}

// functions
function login() {
  const name = document.getElementById("username").value.trim();
  if (!name) {
    alert("Please enter your name");
    return;
  }
  currentUser = name;
  loginScreen.classList.remove("active");
  startScreen.classList.add("active");
}

function startQuiz() {
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  const q = questions[currentQuestion];
  questionText.innerText = q.question;
  questionNumber.innerText = `${currentQuestion + 1} of ${questions.length}`;
  updateProgressBar();

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => selectOption(index);
    optionsDiv.appendChild(btn);
  });

  startTimer();
}

function resetState() {
  optionsDiv.innerHTML = "";
  clearInterval(timer);
  timeLeft = 10;
  timerDisplay.innerText = `Time Left: ${timeLeft}s`;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      autoNext();
    }
  }, 1000);
}

function selectOption(index) {
  clearInterval(timer);
  const buttons = optionsDiv.children;
  const correctAnswer = questions[currentQuestion].answer;

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    if (i === correctAnswer) {
      buttons[i].classList.add("correct");
    }
  }

  if (index === correctAnswer) {
    score++;
  } else {
    buttons[index].classList.add("incorrect");
  }

  setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function autoNext() {
  nextQuestion();
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  const percentage = Math.round((score / questions.length) * 100);
  let message = "";
  if (percentage >= 80) message = "Excellent Work! 🎉";
  else if (percentage >= 50) message = "Good Job 👍";
  else message = "Keep Practicing 💪";

  leaderboard.push({ name: currentUser, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  let boardHTML = "<h3>🏆 Leaderboard</h3>";
  leaderboard.forEach((u, idx) => {
    boardHTML += `${idx + 1}. ${u.name} - ${u.score}<br>`;
  });

  document.getElementById("scoreText").innerHTML =
    `You scored ${score}/${questions.length} (${percentage}%)<br><br>${boardHTML}`;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
}

function updateProgressBar() {
  const progress = document.querySelector(".progress");
  if (!progress) return;
  const percent = (currentQuestion / questions.length) * 100;
  progress.style.width = percent + "%";
}
