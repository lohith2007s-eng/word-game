const WORDS = [
  "planet",
  "coffee",
  "canvas",
  "puzzle",
  "wizard",
  "jungle",
  "galaxy",
  "orange",
  "rocket",
  "memory",
  "little",
  "forest",
  "autumn",
  "modern",
  "quiet",
  "letter",
  "friend",
  "summer",
  "window",
  "dynamic",
];

const MAX_TRIES = 6;

const dom = {
  word: document.getElementById("word"),
  score: document.getElementById("score"),
  tries: document.getElementById("tries"),
  guess: document.getElementById("guess"),
  submit: document.getElementById("submit"),
  reset: document.getElementById("reset"),
  message: document.getElementById("message"),
};

let state = {
  answer: "",
  revealed: [],
  used: new Set(),
  remaining: MAX_TRIES,
  score: 0,
  finished: false,
};

function pickWord() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return word.toLowerCase();
}

function resetGame() {
  state.answer = pickWord();
  state.revealed = Array(state.answer.length).fill(false);
  state.used.clear();
  state.remaining = MAX_TRIES;
  state.finished = false;

  dom.guess.value = "";
  dom.guess.removeAttribute("disabled");
  dom.submit.removeAttribute("disabled");

  updateUI();
  showMessage("Guess a letter!");
  dom.guess.focus();
}

function updateUI() {
  dom.word.innerHTML = "";

  state.answer.split("").forEach((letter, idx) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = state.revealed[idx] ? letter : "";
    dom.word.appendChild(span);
  });

  dom.tries.textContent = state.remaining;
  dom.score.textContent = state.score;

  if (state.finished) {
    dom.guess.setAttribute("disabled", "");
    dom.submit.setAttribute("disabled", "");
  }
}

function showMessage(text, type = "normal") {
  dom.message.textContent = text;
  dom.message.style.color =
    type === "danger" ? "var(--danger)" : type === "success" ? "var(--success)" : "var(--text)";
}

function validateGuess(value) {
  if (!value) return "Type a letter.";
  if (!/^[a-zA-Z]$/.test(value)) return "Use a single A–Z letter.";
  if (state.used.has(value)) return `You already tried \"${value}\".`;
  return null;
}

function checkWin() {
  return state.revealed.every(Boolean);
}

function handleGuess() {
  if (state.finished) return;

  const raw = dom.guess.value.trim().toLowerCase();
  dom.guess.value = "";

  const validation = validateGuess(raw);
  if (validation) {
    showMessage(validation, "danger");
    return;
  }

  const letter = raw;
  state.used.add(letter);

  if (state.answer.includes(letter)) {
    state.answer.split("").forEach((char, idx) => {
      if (char === letter) state.revealed[idx] = true;
    });

    showMessage(`Nice! The word contains \"${letter}\".`, "success");
  } else {
    state.remaining -= 1;
    showMessage(`Sorry, \"${letter}\" is not in the word.`, "danger");
  }

  if (checkWin()) {
    state.finished = true;
    state.score += 1;
    showMessage("🎉 You got it! Click New Word to play again.", "success");
  } else if (state.remaining <= 0) {
    state.finished = true;
    showMessage(`Game over! The word was \"${state.answer}\".`, "danger");
  }

  updateUI();
}

function init() {
  dom.submit.addEventListener("click", handleGuess);
  dom.reset.addEventListener("click", resetGame);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!state.finished) {
        handleGuess();
      }
    }
  });

  resetGame();
}

init();
