const boardModule = (() => {
  const button = document.querySelector("#button");
  const displayBoard = document.querySelector("#board");

  function setupBoard(board, player) {
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const span = document.createElement("span");
        displayBoard.appendChild(span);
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
            if (player === "O") {
              setTimeout(() => {
                const bestMove = findBestMove(board, "O"); // AI's symbol is "O"
                board[bestMove.row][bestMove.col] = "O"; // AI's move
                const aiSpan =
                  displayBoard.children[bestMove.row * 3 + bestMove.col];
                aiSpan.textContent = "O";
                aiSpan.style.pointerEvents = "none";

                if (gameModule.checkWin("O")) {
                  resetRound(board, player);
                  button.textContent = "O wins! Continue?";
                } else if (gameModule.checkDraw()) {
                  resetRound(board, player);
                  button.textContent = "It's a draw. Continue?";
                } else {
                  player = "X";
                  button.textContent = player + "'s turn";
                }
              }, 500);
            }
          }
        });
      });
    });
  }

  function findBestMove(board, player) {
    let bestScore = -Infinity;
    let bestMove = { row: -1, col: -1 };

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === "") {
          board[row][col] = player;
          let score = minimax(board, 0, false);
          board[row][col] = ""; // Reset the cell

          if (score > bestScore) {
            bestScore = score;
            bestMove.row = row;
            bestMove.col = col;
          }
        }
      }
    }

    return bestMove;
  }
  // ... (rest of your code)

  function evaluate(node) {
    if (gameModule.checkWin("X")) {
      return -10; // X wins
    } else if (gameModule.checkWin("O")) {
      return 10; // O wins
    } else {
      return 0; // It's a draw
    }
  }

  function getChildren(node, player) {
    const children = [];

    for (let row = 0; row < node.length; row++) {
      for (let col = 0; col < node[row].length; col++) {
        if (node[row][col] === "") {
          const childNode = JSON.parse(JSON.stringify(node)); // Clone the current board
          childNode[row][col] = player; // Simulate the move
          children.push(childNode);
        }
      }
    }

    return children;
  }

  function minimax(node, depth, maximizingPlayer) {
    if (
      depth === 0 ||
      gameModule.checkWin("X") ||
      gameModule.checkWin("O") ||
      gameModule.checkDraw()
    ) {
      return evaluate(node);
    }

    if (maximizingPlayer) {
      let bestValue = -Infinity;
      const children = getChildren(node, "O"); // AI plays as "O"

      for (let childNode of children) {
        let value = minimax(childNode, depth - 1, false);
        bestValue = Math.max(bestValue, value);
      }

      return bestValue;
    } else {
      let bestValue = Infinity;
      const children = getChildren(node, "X"); // Player plays as "X"

      for (let childNode of children) {
        let value = minimax(childNode, depth - 1, true);
        bestValue = Math.min(bestValue, value);
      }

      return bestValue;
    }
  }

  // ... (rest of your code)

  function resetRound(board, player) {
    button.addEventListener("click", resetBoard.bind(null, board, player));
    button.style.pointerEvents = "auto";
    player = player === "X" ? "O" : "X";
    displayBoard.style.pointerEvents = "none";
  }

  function resetBoard(board, player) {
    button.removeEventListener("click", resetBoard.bind(null, board, player));
    button.style.pointerEvents = "none";
    button.textContent = player + "'s turn";

    board.forEach((row) => row.fill(""));
    displayBoard.innerHTML = "";
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
