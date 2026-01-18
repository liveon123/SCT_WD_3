const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modeInputs = document.querySelectorAll('input[name="mode"]');

let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp"; // default mode

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // columns
  [0,4,8],[2,4,6]          // diagonals
];

// Add event listeners
board.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', resetGame);
modeInputs.forEach(input => input.addEventListener('change', e => {
  mode = e.target.value;
  resetGame();
}));

function handleCellClick(e) {
  const clickedCell = e.target;
  const index = clickedCell.dataset.index;

  if (gameState[index] !== "" || !gameActive) return;

  updateCell(clickedCell, index, currentPlayer);
  checkResult();

  if (mode === "pvc" && currentPlayer === "O" && gameActive) {
    setTimeout(computerMove, 300);
  }
}

function updateCell(cell, index, player) {
  gameState[index] = player;
  cell.textContent = player;
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkResult() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a,b,c] = winningConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  switchPlayer();
}

// Simple computer move (random empty cell)
function computerMove() {
  const emptyIndices = gameState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
  updateCell(cell, randomIndex, currentPlayer);
  checkResult();
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  document.querySelectorAll('.cell').forEach(cell => cell.textContent = "");
}
