import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [gridSize, setGridSize] = useState(3);
  const [winStreak, setWinStreak] = useState(3);
  const [grid, setGrid] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0);
  const [winningCells, setWinningCells] = useState([]); // Track winning cells

  useEffect(() => {
    // Initialize the grid with an empty array when grid size changes
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    setGrid(newGrid);
    setWinner(null);
    setMoves(0);
    setWinningCells([]); // Reset winning cells
  }, [gridSize]);

  const handleCellClick = (row, col) => {
    if (!grid[row][col] && !winner) {
      const newGrid = [...grid];
      newGrid[row][col] = currentPlayer;
      setGrid(newGrid);
      setMoves((prev) => prev + 1);

      const winningCells = checkWinner(newGrid, row, col);
      if (winningCells) {
        setWinner(currentPlayer);
        setWinningCells(winningCells); // Store winning cells
      } else if (moves + 1 === gridSize * gridSize) {
        setWinner('Draw');
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    }
  };

  const checkWinner = (newGrid, row, col) => {
    const directions = [
      { x: 0, y: 1 }, { x: 1, y: 0 }, // Horizontal and Vertical
      { x: 1, y: 1 }, { x: 1, y: -1 } // Diagonals
    ];

    const checkLine = (dx, dy) => {
      let count = 1;
      let cells = [[row, col]]; // Track cells in the line
      for (let dir of [-1, 1]) {
        let r = row + dir * dx;
        let c = col + dir * dy;
        while (r >= 0 && r < gridSize && c >= 0 && c < gridSize && newGrid[r][c] === currentPlayer) {
          count++;
          cells.push([r, c]); // Add this cell to the list
          if (count === winStreak) return cells;
          r += dir * dx;
          c += dir * dy;
        }
      }
      return null;
    };

    for (const { x, y } of directions) {
      const result = checkLine(x, y);
      if (result) return result;
    }
    return null;
  };

  const handleReset = () => {
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    setGrid(newGrid);
    setWinner(null);
    setCurrentPlayer('X');
    setMoves(0);
    setWinningCells([]); // Reset winning cells
  };

  const isWinningCell = (row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl text-center mb-4 font-semibold">Tic-Tac-Toe</h1>

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

      <div className="grid grid-cols-3 gap-4 justify-center mb-6 p-5" style={{ gridTemplateColumns: `repeat(${gridSize}, 0fr)` }}>
        {grid.map((row, rowIndex) => row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 border border-gray-400 flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-200 ${isWinningCell(rowIndex, colIndex) ? 'bg-green-300' : ''}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell}
          </div>
        )))}
      </div>

      {winner && (
        <div className="text-center mb-6">
          <h2 className="text-xl">{winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}</h2>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button onClick={handleReset} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default App;
