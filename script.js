const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endGameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

let groupOfWords;

// Declare intial score
let score = 0;

// Get difficulty from localStorage
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "easy";
console.log(difficulty);

// Declare initial time based on difficulty
const initialTimes = {
  easy: 7,
  medium: 10,
  hard: 15,
  expert: 20,
};

let time = initialTimes[difficulty] || 7;

function addDifficultyTimer() {
  if (difficulty === "easy") {
    time += 3;
  } else if (difficulty === "medium" || difficulty === "hard") {
    time += 10;
  } else if (difficulty === "expert") {
    time += 15;
  }
}

difficultySelect.value = localStorage.getItem("difficulty");

text.focus();

const timeInterval = setInterval(updateTime, 1000);

fetch("words.json")
  .then((res) => res.json())
  .then((words) => {
    const wordSet = localStorage.getItem("difficulty");
    function getRandomWord() {
      return Math.floor(Math.random() * words[wordSet].length);
    }

    function genNewWord() {
      groupOfWords = words[wordSet][getRandomWord()]; // Assign groupOfWords here
      word.textContent = groupOfWords;
    }

    genNewWord();

    text.addEventListener("input", (e) => {
      let wordInput = e.target.value;
      word.innerHTML = groupOfWords
        .split("")
        .map((letter, index) => {
          if (wordInput[index] === letter) {
            return `<span class="correct">${letter}</span>`;
          } else {
            return `<span class="incorrect">${letter}</span>`;
          }
        })
        .join("");
      if (wordInput === groupOfWords) {
        genNewWord();
        text.value = "";
        addDifficultyTimer();
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

// Prevent copy and pasting to text input
text.addEventListener("copy", function (e) {
  e.preventDefault();
});

text.addEventListener("cut", function (e) {
  e.preventDefault();
});

text.addEventListener("paste", function (e) {
  e.preventDefault();
});
