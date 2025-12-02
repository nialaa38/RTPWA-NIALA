import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaPause, FaRedo, FaHome, FaTrophy, FaVolleyballBall } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './VolleyballGame.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function VolleyballGame({ setAuth }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [ballPosition, setBallPosition] = useState(50);
  const [ballDirection, setBallDirection] = useState(1);
  const [difficulty, setDifficulty] = useState('medium');
  const [message, setMessage] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('volleyballHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const speed = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 12;
    
    const interval = setInterval(() => {
      setBallPosition(prev => {
        let newPos = prev + (ballDirection * 2);
        
        if (newPos >= 95 || newPos <= 5) {
          setBallDirection(d => -d);
          newPos = newPos >= 95 ? 95 : 5;
        }
        
        return newPos;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gameState, ballDirection, difficulty]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') handleHit();
        else if (gameState === 'menu') startGame();
        else if (gameState === 'gameOver') resetGame();
      }
      if (e.code === 'KeyP' && gameState === 'playing') {
        setGameState('paused');
      }
      if (e.code === 'KeyP' && gameState === 'paused') {
        setGameState('playing');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, ballPosition]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCombo(0);
    setTotalHits(0);
    setBallPosition(50);
    setBallDirection(1);
    setMessage('');
  };

  const handleHit = useCallback(() => {
    if (gameState !== 'playing') return;

    const hitZone = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10;
    const center = 50;
    const distance = Math.abs(ballPosition - center);

    if (distance <= hitZone) {
      // Hit!
      const accuracy = Math.round(100 - (distance / hitZone) * 100);
      const points = Math.round(10 + (accuracy / 10) + (combo * 2));
      
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setTotalHits(prev => prev + 1);
      
      if (accuracy >= 90) setMessage('🔥 PERFECT! +' + points);
      else if (accuracy >= 70) setMessage('⚡ GREAT! +' + points);
      else setMessage('✨ GOOD! +' + points);

      // Reverse ball direction
      setBallDirection(d => -d);
    } else {
      // Miss!
      setCombo(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        }
        return newLives;
      });
      setMessage('❌ MISS!');
    }

    setTimeout(() => setMessage(''), 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, ballPosition, difficulty, combo]);

  // Save game when game over
  useEffect(() => {
    if (gameState !== 'gameOver') return;
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('volleyballHighScore', score.toString());
    }

    // Save game stats
    const saveGame = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/api/tasks`, {
          title: `Volleyball Game - Score: ${score}`,
          description: `Hits: ${totalHits}, Best Combo: ${combo}`,
          category: 'game',
          priority: 'medium',
          status: 'completed'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error saving game:', error);
      }
    };
    
    saveGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setLives(3);
    setCombo(0);
    setTotalHits(0);
    setMessage('');
  };

  return (
    <div className="game-page">
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <Navbar setAuth={setAuth} />

      <div className="game-wrapper">
        {/* Game Header */}
        <div className="game-header-new">
          <div className="game-title">
            <FaVolleyballBall className="title-icon" />
            <h1>Spike Master</h1>
          </div>
          <div className="game-scores">
            <div className="score-item">
              <span className="score-label">Score</span>
              <span className="score-value">{score}</span>
            </div>
            <div className="score-item high">
              <FaTrophy />
              <span className="score-value">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Game Stats Bar */}
        {gameState !== 'menu' && (
          <div className="game-stats-bar">
            <div className="stat-pill">
              <span>❤️</span>
              <span>{lives}</span>
            </div>
            <div className="stat-pill combo">
              <span>🔥</span>
              <span>{combo}x</span>
            </div>
            <div className="stat-pill">
              <span>🎯</span>
              <span>{totalHits}</span>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="game-area">
          {gameState === 'menu' && (
            <div className="menu-screen">
              <div className="menu-icon">🏐</div>
              <h2>Ready to Spike?</h2>
              <p>Hit the ball when it's in the center zone!</p>
              
              <div className="difficulty-selector">
                <button 
                  className={`diff-btn ${difficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => setDifficulty('easy')}
                >
                  Easy
                </button>
                <button 
                  className={`diff-btn ${difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => setDifficulty('medium')}
                >
                  Medium
                </button>
                <button 
                  className={`diff-btn ${difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => setDifficulty('hard')}
                >
                  Hard
                </button>
              </div>

              <button className="play-btn" onClick={startGame}>
                <FaPlay /> Start Game
              </button>
              
              <button className="home-btn" onClick={() => navigate('/dashboard')}>
                <FaHome /> Back to Dashboard
              </button>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'paused') && (
            <div className="play-screen">
              {gameState === 'paused' && (
                <div className="pause-overlay-new">
                  <h2>⏸️ Paused</h2>
                  <button onClick={() => setGameState('playing')}>
                    <FaPlay /> Resume
                  </button>
                </div>
              )}

              <div className="court">
                <div className="hit-zone"></div>
                <div 
                  className="ball"
                  style={{ left: `${ballPosition}%` }}
                >
                  🏐
                </div>
              </div>

              {message && (
                <div className={`hit-message ${message.includes('MISS') ? 'miss' : 'hit'}`}>
                  {message}
                </div>
              )}

              <button 
                className="spike-button"
                onClick={handleHit}
                disabled={gameState !== 'playing'}
              >
                💪 SPIKE!
              </button>

              <div className="game-controls-new">
                <button onClick={() => setGameState(gameState === 'paused' ? 'playing' : 'paused')}>
                  {gameState === 'paused' ? <FaPlay /> : <FaPause />}
                </button>
                <button onClick={resetGame}>
                  <FaRedo />
                </button>
              </div>

              <p className="hint">Press SPACE to spike • P to pause</p>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="gameover-screen">
              <h2>Game Over!</h2>
              
              <div className="final-score">
                <span className="final-label">Final Score</span>
                <span className="final-value">{score}</span>
              </div>

              {score >= highScore && score > 0 && (
                <div className="new-record">🏆 New High Score!</div>
              )}

              <div className="final-stats-grid">
                <div className="final-stat">
                  <span>🎯</span>
                  <span>{totalHits} Hits</span>
                </div>
                <div className="final-stat">
                  <span>🔥</span>
                  <span>{combo}x Best Combo</span>
                </div>
              </div>

              <div className="gameover-actions">
                <button className="retry-btn" onClick={startGame}>
                  <FaRedo /> Play Again
                </button>
                <button className="menu-btn" onClick={resetGame}>
                  Menu
                </button>
                <button className="dashboard-btn-new" onClick={() => navigate('/dashboard')}>
                  <FaHome /> Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="instructions-card">
          <h3>How to Play</h3>
          <div className="instruction-items">
            <span>🎯 Hit when ball is in the center</span>
            <span>🔥 Build combos for bonus points</span>
            <span>❤️ 3 lives - don't miss!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolleyballGame;
