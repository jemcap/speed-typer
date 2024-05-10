const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endGameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

let easyWords;

// Declare intial time
let time = 10;

// Declare intial score
let score = 0;

// Get difficulty from localStorage
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";
console.log(difficulty);

difficultySelect.value = localStorage.getItem("difficulty");

text.focus();

const timeInterval = setInterval(updateTime, 1000);

fetch("words.json")
  .then((res) => res.json())
  .then((words) => {
    function getRandomWord() {
      return Math.floor(Math.random() * words.easy.length);
    }

    function genNewWord() {
      easyWords = words.easy[getRandomWord()]; // Assign easyWords here
      word.textContent = easyWords;
    }

    genNewWord();

    text.addEventListener("input", (e) => {
      console.log(e.target.value);
      let wordInput = e.target.value;
      if (wordInput === easyWords) {
        genNewWord();
        text.value = "";
        updateScore();
      }
    });
  })
  .catch((error) => console.error("Error fetching JSON:", error));

function updateScore() {
  score++;
  scoreEl.textContent = score;
}

function updateTime() {
  time--;
  timeEl.innerHTML = `${time}s`;
  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

function gameOver() {
  endGameEl.innerHTML = `
    <h1>Game Over!</h2>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Play Again</button>
    `;
  endGameEl.style.display = "flex";
}

settingsBtn.addEventListener("click", () => {
  settings.classList.toggle("hide");
});

settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
  location.reload();
  console.log(e.target.value);
});
