import { useEffect, useState } from "react";
import "./ColorGame.css"; 

const generateColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};

const generateShades = (target: string) => {
  const [r, g, b] = target
    .match(/\d+/g)
    ?.map(Number) || [0, 0, 0];

  return Array.from({ length: 6 }, () => {
    const variation = Math.floor(Math.random() * 60) - 30; // Slight variation
    return `rgb(${Math.min(255, Math.max(0, r + variation))},
                ${Math.min(255, Math.max(0, g + variation))},
                ${Math.min(255, Math.max(0, b + variation))})`;
  });
};

const ColorGame = () => {
  const [targetColor, setTargetColor] = useState<string>("");
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    startNewRound();
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startNewRound = () => {
    const newTarget = generateColor();
    const shades = generateShades(newTarget);
    const randomIndex = Math.floor(Math.random() * 6);
    shades[randomIndex] = newTarget; // Ensure one correct option

    setTargetColor(newTarget);
    setColorOptions(shades);
  };

  const handleGuess = (color: string) => {
    if (color === targetColor) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= 50) setWin(true);
        return newScore;
      });
    }
    startNewRound();
  };

  const resetGame = () => {
    setScore(0);
    setTimer(300);
    setGameOver(false);
    setWin(false);
    startNewRound();
  };

  return (
    <div className="game-container">
      {gameOver ? (
        <div className="game-over">
          <h1>Game Over! 😢</h1>
          <p>Your score: {score}</p>
          <button className="new-game-button" onClick={resetGame}>Play Again</button>
        </div>
      ) : win ? (
        <div className="game-win">
          <h1>🎉 You Win! 🎉</h1>
          <p>Final Score: {score}</p>
          <button className="new-game-button" onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <>
          <h1 className="game-title">Color Guessing Game</h1>
          <p className="game-instructions">Guess the correct shade!</p>
          <p>You have to get 50 points in 5mins to win the game 🙃 </p>

          <div data-testid="colorBox" className="color-box" style={{ backgroundColor: targetColor }}></div>

          <div className="color-options">
            {colorOptions.map((color, index) => (
              <button
              title="color"
                key={index}
                data-testid="colorOption"
                className="color-button"
                style={{ backgroundColor: color }}
                onClick={() => handleGuess(color)}
              ></button>
            ))}
          </div>

          <p className="score">Score: {score}</p>
          <p className="timer">Time Left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>

          <button className="new-game-button" onClick={resetGame}>Reset Score</button>
        </>
      )}
    </div>
  );
};

export default ColorGame;
