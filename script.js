const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endGameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
const typeTime = document.getElementById("typing-speed");

let groupOfWords;

let wordInput;
let typingSpeed;

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
  easy: 10,
  medium: 15,
  hard: 30,
  expert: 45,
};

let time = initialTimes[difficulty] || 7;

let startTime;

function addDifficultyTimer() {
  if (difficulty === "easy") {
    time += 3;
  } else if (difficulty === "medium") {
    time += 7;
  } else if (difficulty === "hard") {
    time += 12;
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
      startTime = Date.now(); // Reset startTime when a new word is generated
      groupOfWords = words[wordSet][getRandomWord()]; // Assign groupOfWords here
      word.textContent = groupOfWords;
    }

    genNewWord();

    text.addEventListener("input", (e) => {
      wordInput = e.target.value.trim();
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
        // const endTime = Date.now();
        // const elapsedTimeInSeconds = (endTime - startTime) / 1000;
        // const typedWordCount = wordInput.split(/\s+/).length;
        // const typingSpeed = (typedWordCount / elapsedTimeInSeconds) * 60;
        // console.log(`Typing speed: ${typingSpeed.toFixed(2)} words per minute`);
        // Reset start time for the next word
        updateScore();

        genNewWord();
        startTime = Date.now();
        text.value = "";
        typeTime.innerHTML = `Typing speed: ${typingSpeed.toFixed(2)} WPM`;
        addDifficultyTimer();
      }
    });
  })
  .catch((error) => console.error("Error fetching JSON:", error));

function updateScore() {
  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  const typedWordCount = wordInput.split(/\s+/).length;
  typingSpeed = (typedWordCount / elapsedTimeInSeconds) * 60;
  console.log(`Typing speed: ${typingSpeed.toFixed(2)} words per minute`);
  if (typingSpeed.toFixed(2) > 60) {
    score += 3;
  } else if (typingSpeed.toFixed(2) > 50 && typingSpeed.toFixed(2) <= 60) {
    score += 2;
  } else {
    score++;
  }

  scoreEl.textContent = score;
  scoreEl.style.color = "green";
}

function updateTime() {
  time--;
  timeEl.innerHTML = `${time}s`;
  timeEl.classList.add = "timer";
  if (time > 6) {
    timeEl.style.color = "#fff";
  } else if (time <= 6 && time > 3) {
    timeEl.style.color = "orange";
  } else if (time <= 3) {
    timeEl.style.color = "red";
  }
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
