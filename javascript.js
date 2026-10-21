const gameBoard = (() => {
   let board = ['', '', '', '', '', '', '', '', ''];

   const getBoard = () => [...board];

   const setCell = (index, mark) => {
      if (board[index] === '') {
         board[index] = mark;
         return true;
      }
      return false;
   };

   const resetBoard = () => {
      board = ['', '', '', '', '', '', '', '', ''];
   };

   const showBoard = () => console.log(board);

   return { getBoard, setCell, resetBoard, showBoard };
})();

const createPlayer = (name, marker) => {
   const getName = () => name;
   const getMarker = () => marker;

   const makeMove = (index, boardObj) => boardObj.setCell(index, marker);

   return { getName, getMarker, makeMove };
};

const gameController = (() => {
   const players = [
      createPlayer('Player 1', 'X'),
      createPlayer('Player 2', 'O')
   ];
   const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
   ];

   let activePlayer = players[0];
   let gameOver = false;
   let result = null;

   const switchTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   };

   const getActivePlayer = () => activePlayer;
   const getResult = () => result;
   const isGameOver = () => gameOver;

   const playRound = (index) => {
      if (gameOver) {
         console.log('Game is over. Restart');
         return;
      }

      const success = activePlayer.makeMove(index, gameBoard);
      if (!success) {
         console.log('Spot already taken! Choose another.');
         return;
      }

      const currentBoard = gameBoard.getBoard();
      const marker = activePlayer.getMarker();
      const isWinningMove = winningCombinations.some((combination) =>
         combination.every((idx) => currentBoard[idx] === marker)
      );

      if (isWinningMove) {
         gameOver = true;
         result = `${activePlayer.getName()} wins!`;
         console.log(result);
         gameBoard.showBoard();
         return;
      }

      const isTie = currentBoard.every((cell) => cell !== '');

      if (isTie) {
         gameOver = true;
         result = 'Its a tie!';
         console.log(result);
         gameBoard.showBoard();
         return;
      }

      switchTurn();
      gameBoard.showBoard();
      console.log(`It is now ${activePlayer.getName()}'s turn.`);
   };

   const resetGame = () => {
      gameBoard.resetBoard();
      gameOver = false;
      activePlayer = players[0];
      result = null;
      console.log('Game reset! Player 1 goes first.');
   };

   return { getActivePlayer, getResult, isGameOver, playRound, resetGame };
})();

const displayController = (() => {
   const gameContainer = document.querySelector('.game-container');
   const turn = document.querySelector('.turn');
   const status = document.querySelector('.status');
   const resetBtn = document.querySelector('.reset');

   const render = () => {
      gameContainer.replaceChildren();
      const cells = gameBoard.getBoard();

      cells.forEach((mark, index) => {
         const btn = document.createElement('button');
         btn.type = 'button';
         btn.textContent = mark;
         btn.dataset.index = index;
         gameContainer.append(btn);
      });

      turn.textContent = `${gameController.getActivePlayer().getName()}'s turn`;
      status.textContent = gameController.getResult();
   };

   const handleClick = (event) => {
      if (!event.target.matches('button')) return;

      const index = Number(event.target.dataset.index)
      gameController.playRound(index)
      render()
   };

   const resetGame = () => {
      gameController.resetGame()
      render();
   }

   gameContainer.addEventListener('click', handleClick);
   resetBtn.addEventListener('click', resetGame)

   return { render };

})();

displayController.render();