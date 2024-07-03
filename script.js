const container = document.getElementById("container");
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

let typedWords = [];
let scoresArr = JSON.parse(localStorage.getItem("highScores")) || [];

let groupOfWords;

let wordInput;
let typingSpeed;

// Declare intial score
let score;
let averageSpeed;

// Get difficulty from localStorage
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : localStorage.setItem("difficulty", "easy");
console.log(difficulty);

// Declare initial time based on difficulty
const initialTimes = {
  easy: 5,
  medium: 15,
  hard: 45,
  expert: 75,
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

      // Clear previous word and cursor
      word.innerHTML = "";

      // Append the word
      word.innerHTML += groupOfWords;

      // Append the animated cursor
      const cursorSpan = document.createElement("span");
      cursorSpan.classList.add("cursor");
      word.appendChild(cursorSpan);
    }

    genNewWord();

    text.addEventListener("input", (e) => {
      wordInput = e.target.value.trim();
      word.innerHTML = groupOfWords
        .split("")
        .map((letter, index) => {
          if (wordInput[index] === letter) {
            return `<span class="correct" style="background-color: rgba(0, 255, 0, 0.1);">${letter}</span>`;
          } else {
            return `<span class="incorrect">${letter}</span>`;
          }
        })
        .join("");

      if (wordInput === groupOfWords) {
        updateScore();

        addTypedWord(groupOfWords, typingSpeed);

        genNewWord();
        startTime = Date.now();
        text.value = "";
        typeTime.innerHTML = `${typingSpeed.toFixed(2)} WPM`;
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
  if (typingSpeed.toFixed(2) > 90) {
    score = "Fantastic!";
    scoreEl.style.color = "limegreen";
  } else if (typingSpeed.toFixed(2) > 60 && typingSpeed.toFixed(2) <= 90) {
    score = "Great!";
    scoreEl.style.color = "green";
  } else if (typingSpeed.toFixed(2) > 40 && typingSpeed.toFixed(2) <= 60) {
    score = "Good!";
    scoreEl.style.color = "orange";
  } else {
    score = "Slow";
    scoreEl.style.color = "red";
  }

  scoreEl.textContent = score;
}

function updateTime() {
  time--;
  timeEl.innerHTML = `${time}s`;
  timeEl.classList.add = "timer";
  if (time > 6) {
    timeEl.style.color = "#424245";
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

function addTypedWord(word, speed) {
  typedWords.push({ word, speed });
}

function gameOver() {
  let totalSpeed = 0;
  averageSpeed = 0;

  typedWords.forEach((word) => {
    totalSpeed += word.speed;
  });

  if (typedWords.length > 0) {
    averageSpeed = totalSpeed / typedWords.length;
  }

  let typedWordsHTML = typedWords
    .map((item) => {
      return `<li class="game-over__list">${
        item.word
      }  <span id="end__words-per-min">${item.speed.toFixed(
        2
      )} WPM</span></li>`;
    })
    .join("");

  let scoreMessage = "";
  // Determine score message based on average typing speed
  if (averageSpeed > 90) {
    scoreMessage =
      "Your typing is fantastic! Challenge yourself to a higher difficulty!";
  } else if (averageSpeed > 60 && averageSpeed <= 90) {
    scoreMessage =
      "Great job! you're a fast typer! I suggest you challenge yourself to a higher difficulty.";
  } else if (averageSpeed > 40 && averageSpeed <= 60) {
    scoreMessage =
      "That was a good run! But I'm sure you can get faster than that!";
  } else if (averageSpeed > 5 && averageSpeed < 40) {
    scoreMessage =
      "You're not fast enough just yet. Go ahead and practice more!";
  } else {
    scoreMessage = "Give it another try!";
  }

  endGameEl.innerHTML = `
    <h1>Time's up!</h2>
    <p>${scoreMessage}</p>
    <p>Your average typing speed is ${averageSpeed.toFixed(2)} WPM </p>
    <ul class="game-over-list__container">${typedWordsHTML}</ul>
    <p id="initials-box">Enter initials: <input type="text" id="initials" max="3" /><button id="submit">Submit</button></p>
    <button class="play-again-btn" onclick="location.reload()">Play Again</button>
    `;
  endGameEl.style.display = "flex";
  container.remove();
}

// Add event listener to the endGameEl for click events
endGameEl.addEventListener("click", function (event) {
  // Check if the click event occurred on the submit button
  if (event.target.id === "submit") {
    // Get the value of the initials input field
    const initials = document.getElementById("initials").value.toUpperCase();
    // Call a function to submit the initials

    submitInitials(initials);
    let playerData = difficulty + averageSpeed + " - " + initials.value;
    scoresArr.push(playerData);
    document.location.replace("/highscores.html");
  }
});

// Function to submit initials
function submitInitials(initials) {
  let playerData = {
    difficulty: difficulty,
    initials: initials,
    typingSpeed: parseFloat(averageSpeed.toFixed(2)),
  };
  scoresArr.push(playerData);

  scoresArr.sort((a, b) => b.typingSpeed - a.typingSpeed);

  localStorage.setItem("highScores", JSON.stringify(scoresArr)); // Store the array in localStorage
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
