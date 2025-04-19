let players = [];
let scores = [];
let currentPlayer = 0;
let roundScore = 0;
let gameHistory = JSON.parse(localStorage.getItem("history")) || [];

function showPlayerForm() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("player-setup").classList.remove("hidden");
}

function generatePlayerInputs() {
  const num = parseInt(document.getElementById("numPlayers").value);
  const container = document.getElementById("playerInputs");
  container.innerHTML = "";
  for (let i = 0; i < num; i++) {
    const input = document.createElement("input");
    input.placeholder = "Player " + (i + 1);
    input.id = "player-" + i;
    container.appendChild(input);
  }
}

function startGame() {
  const num = parseInt(document.getElementById("numPlayers").value);
  players = [];
  scores = new Array(num).fill(0);
  for (let i = 0; i < num; i++) {
    players.push(document.getElementById("player-" + i).value || ("Player " + (i + 1)));
  }
  currentPlayer = 0;
  roundScore = 0;
  document.getElementById("player-setup").classList.add("hidden");
  showGameScreen();
}

function showGameScreen() {
  document.getElementById("game-screen").classList.remove("hidden");
  document.getElementById("current-player").innerText = players[currentPlayer] + "'s Turn";
  document.getElementById("round-score").innerText = roundScore;
}

function roll(number) {
  if (number === 1) {
    roundScore = 0;
    document.getElementById("game-screen").classList.add("hidden");
    showScoreboard();
  } else {
    roundScore += number;
    document.getElementById("round-score").innerText = roundScore;
    const projectedScore = scores[currentPlayer] + roundScore;
    if (projectedScore >= 100) {
      scores[currentPlayer] = projectedScore;
      endGame();
    }
  }
}

function stopRound() {
  scores[currentPlayer] += roundScore;
  roundScore = 0;
  if (scores[currentPlayer] >= 100) {
    endGame();
  } else {
    document.getElementById("game-screen").classList.add("hidden");
    showScoreboard();
  }
}

function showScoreboard() {
  const scoreList = document.getElementById("score-list");
  scoreList.innerHTML = "";
  scores.forEach((score, i) => {
    const li = document.createElement("li");
    li.textContent = players[i] + ": " + score;
    scoreList.appendChild(li);
  });
  document.getElementById("scoreboard").classList.remove("hidden");
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % players.length;
  document.getElementById("scoreboard").classList.add("hidden");
  showGameScreen();
}

function endGame() {
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("scoreboard").classList.add("hidden");
  document.getElementById("winner-screen").classList.remove("hidden");
  document.getElementById("winner-name").innerText = players[currentPlayer] + " Wins!";
  const finalList = document.getElementById("final-scores");
  finalList.innerHTML = "";

  const table = document.createElement("table");
  const header = document.createElement("tr");
  players.forEach(player => {
    const th = document.createElement("th");
    th.textContent = player;
    header.appendChild(th);
  });
  table.appendChild(header);

  const scoreRow = document.createElement("tr");
  scores.forEach(score => {
    const td = document.createElement("td");
    td.textContent = score;
    scoreRow.appendChild(td);
  });
  table.appendChild(scoreRow);

  finalList.appendChild(table);

  gameHistory.unshift({ winner: players[currentPlayer], scores: [...scores], names: [...players] });
  localStorage.setItem("history", JSON.stringify(gameHistory.slice(0, 5)));
}

function goToStart() {
  document.getElementById("winner-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
  showHistory();
}

function showHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";
  gameHistory.forEach(game => {
    const li = document.createElement("li");
    let scoreDetails = "";
    game.names.forEach((name, idx) => {
      scoreDetails += `${name}: ${game.scores[idx]} `;
    });
    li.textContent = `${game.winner} won | ${scoreDetails}`;
    historyList.appendChild(li);
  });
}

showHistory();
