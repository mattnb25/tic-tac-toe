const boardModule = (() => {
  const button = document.querySelector("#button");
  const displayBoard = document.querySelector("#board");

  function setupBoard(board, player) {
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const span = document.createElement("span");
        span.setAttribute("role", "button");
        span.setAttribute("tabindex", "0");
        displayBoard.appendChild(span);
        span.addEventListener("keypress", (event) => {
          if (event.key === "Enter") span.click();
        });
        span.addEventListener("click", () => {
          if (board[rowIndex][colIndex] !== "") {
            return;
          }

          board[rowIndex][colIndex] = player;
          span.textContent = board[rowIndex][colIndex];

          if (gameModule.checkWin(player)) {
            resetRound(board, player);
            button.textContent = player + " wins! Continue?";
          } else if (gameModule.checkDraw()) {
            resetRound(board, player);
            button.textContent = "It's a draw. Continue?";
          } else {
            span.style.pointerEvents = "none";
            player = player === "X" ? "O" : "X";
            button.textContent = player + "'s turn";
          }
        });
      });
    });
  }

  function resetRound(board, player) {
    button.addEventListener("click", resetBoard.bind(null, board, player));
    button.style.pointerEvents = "auto";
    player = player === "X" ? "O" : "X";
    displayBoard.style.opacity = "0.5";
    displayBoard.style.pointerEvents = "none";
  }

  function resetBoard(board, player) {
    button.removeEventListener("click", resetBoard.bind(null, board, player));
    button.style.pointerEvents = "none";
    button.textContent = player + "'s turn";

    board.forEach((row) => row.fill(""));
    displayBoard.innerHTML = "";
    displayBoard.style.opacity = "initial";
    displayBoard.style.pointerEvents = "auto";
    setupBoard(board, player);
  }

  return { resetBoard };
})();

const gameModule = (() => {
  let player = "X";
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function checkWin(player) {
    // check rows
    for (let row of board) {
      if (row.every((cell) => cell === player)) {
        return true;
      }
    }

    // check columns
    for (let i = 0; i < board.length; i++) {
      if (board.every((row) => row[i] === player)) {
        return true;
      }
    }

    // Check diagonals for a win
    if (
      board.every((row, index) => row[index] === player) ||
      board.every((row, index) => row[board.length - 1 - index] === player)
    ) {
      return true;
    }

    return false;
  }

  function checkDraw() {
    return board.every((row) => row.every((cell) => cell !== ""));
  }

  boardModule.resetBoard(board, player); // initialize the game

  return { checkWin, checkDraw };
})();
