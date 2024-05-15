// Retrieve and render highscores
let scoresArr = []; // Initialize scoresArr to store player data
let highscores = document.querySelector("#highscores");
let clearBtn = document.querySelector("#clear");

// If data in the array exists, parse each of those elements.
if (localStorage.getItem("highScores")) {
  scoresArr = JSON.parse(localStorage.getItem("highScores")); // Retrieve player data from localStorage
}

renderHiScore();

function renderHiScore() {
  highscores.innerHTML = "";

  // Render a new li for each new high-score submission
  scoresArr.forEach((player, i) => {
    let playerData = scoresArr[i];
    let li = document.createElement("li");
    li.setAttribute("data-index", i);
    li.textContent = `[${playerData.difficulty}] ${playerData.initials}: ${playerData.typingSpeed} WPM`; // Display initials and typing speed
    highscores.appendChild(li);
  });
}

// When the Clear Highscores button is clicked, run a function that clears the localStorage and content of the webpage
clearBtn.addEventListener("click", function () {
  highscores.innerHTML = "";
  localStorage.removeItem("highScores"); // Remove the "typeSpeed" item from localStorage
});
