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
      }
    });
  })
  .catch((error) => console.error("Error fetching JSON:", error));
