import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // State to hold grid size (default is 3x3)
  const [gridSize, setGridSize] = useState(3);
  // State to hold the win streak (default is 3 marks in a row)
  const [winStreak, setWinStreak] = useState(3);
  // State to hold the grid (a 2D array representing the game board)
  const [grid, setGrid] = useState([]);
  // State to track the current player ('X' or 'O')
  const [currentPlayer, setCurrentPlayer] = useState('X');
  // State to track the winner (null if no winner, 'Draw' if the game is a draw)
  const [winner, setWinner] = useState(null);
  // State to track the number of moves made
  const [moves, setMoves] = useState(0);
  // State to store the winning line for highlighting
  const [winningLine, setWinningLine] = useState([]);

  // Effect to initialize the grid whenever the grid size changes
  useEffect(() => {
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    setGrid(newGrid);
    setWinner(null);
    setMoves(0);
    setWinningLine([]);
  }, [gridSize]);

  // Function to handle cell clicks
  const handleCellClick = (row, col) => {
    // If the cell is empty and no winner has been declared
    if (!grid[row][col] && !winner) {
      const newGrid = [...grid];
      newGrid[row][col] = currentPlayer;
      setGrid(newGrid);
      setMoves((prev) => prev + 1);

      // Check if the current player has won after this move
      const winResult = checkWinner(newGrid, row, col);
      if (winResult) {
        setWinner(currentPlayer);
        setWinningLine(winResult); // Store the winning line (row, col, or diagonal)
      } else if (moves + 1 === gridSize * gridSize) {
        setWinner('Draw'); // If the board is full, declare a draw
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X'); // Switch turns
      }
    }
  };

  // Function to check if a player has won
  const checkWinner = (newGrid, row, col) => {
    const directions = [
      { x: 0, y: 1 }, { x: 1, y: 0 }, // Horizontal and Vertical
      { x: 1, y: 1 }, { x: 1, y: -1 } // Diagonals
    ];

    const checkLine = (dx, dy) => {
      let count = 1;
      const line = [[row, col]]; // Store coordinates of winning line

      // Check in both directions along the given axis (horizontal, vertical, diagonal)
      for (let dir of [-1, 1]) {
        let r = row + dir * dx;
        let c = col + dir * dy;
        while (r >= 0 && r < gridSize && c >= 0 && c < gridSize && newGrid[r][c] === currentPlayer) {
          count++;
          line.push([r, c]); // Add cell to the winning line
          if (count === winStreak) return line;
          r += dir * dx;
          c += dir * dy;
        }
      }
      return false;
    };

    // Check all four possible winning directions
    for (let { x, y } of directions) {
      const result = checkLine(x, y);
      if (result) return result;
    }
    return false;
  };

  // Function to reset the game state
  const handleReset = () => {
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    setGrid(newGrid);
    setWinner(null);
    setCurrentPlayer('X');
    setMoves(0);
    setWinningLine([]);
  };

  // Function to check if a cell is part of the winning line
  const isWinningCell = (row, col) => {
    return winningLine.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl text-center mb-4 font-semibold">Tic-Tac-Toe</h1>
      
      {/* Inputs to set grid size and win streak */}
      <div className="flex justify-center gap-10 mb-6 mt-10">
        <div className='text-center'>
          <label className="block mb-2 text-xl">Grid Size (3-10)</label>
          <input
            type="number"
            min="3"
            max="10"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>
        <div className='text-center'>
          <label className="block mb-2 text-xl">Win Streak (3-n)</label>
          <input
            type="number"
            min="3"
            max={gridSize}
            value={winStreak}
            onChange={(e) => setWinStreak(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Grid of cells for the Tic-Tac-Toe game */}
      <div className="grid grid-cols-3 gap-4 justify-center mb-6 p-5" style={{ gridTemplateColumns: `repeat(${gridSize}, 0fr)` }}>
        {grid.map((row, rowIndex) => row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 border border-gray-400 flex items-center justify-center text-2xl cursor-pointer ${isWinningCell(rowIndex, colIndex) ? 'bg-green-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell}
          </div>
        )))}
      </div>

      {/* Display the winner or draw message */}
      {winner && (
        <div className="text-center mb-6">
          <h2 className="text-xl">{winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}</h2>
        </div>
      )}

      {/* Reset button to restart the game */}
      <div className="flex justify-center gap-4">
        <button onClick={handleReset} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default App;
