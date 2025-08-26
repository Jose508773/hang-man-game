import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // Word categories
    const wordCategories = {
        'ANIMALS': ['elephant', 'giraffe', 'penguin', 'kangaroo', 'butterfly', 'dolphin', 'tiger', 'rabbit', 'monkey', 'zebra'],
        'COUNTRIES': ['australia', 'brazil', 'canada', 'denmark', 'egypt', 'france', 'germany', 'india', 'japan', 'kenya'],
        'FRUITS': ['apple', 'banana', 'cherry', 'dragon', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon'],
        'SPORTS': ['basketball', 'football', 'tennis', 'swimming', 'cycling', 'boxing', 'golf', 'hockey', 'volleyball', 'baseball']
    };

    // Game state
    const [secretWord, setSecretWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [guess, setGuess] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [currentCategory, setCurrentCategory] = useState('');

    const maxWrongGuesses = 6;

    // Start a new game
    const startGame = (selectedCategory) => {
        let word;
        let usedCategory;
        
        if (selectedCategory && wordCategories[selectedCategory]) {
            const words = wordCategories[selectedCategory];
            word = words[Math.floor(Math.random() * words.length)];
            usedCategory = selectedCategory;
        } else {
            // Random category
            const categories = Object.keys(wordCategories);
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const words = wordCategories[randomCategory];
            word = words[Math.floor(Math.random() * words.length)];
            usedCategory = randomCategory;
        }

        setSecretWord(word.toLowerCase());
        setCurrentCategory(usedCategory);
        setGuessedLetters([]);
        setWrongGuesses(0);
        setGameOver(false);
        setWin(false);
        setMessage('');
        setGuess('');
    };

    // Initialize game on first load
    useEffect(() => {
        startGame('');
    }, []);

    // Check game status
    useEffect(() => {
        if (secretWord) {
            const displayWord = getDisplayWord();
            if (!displayWord.includes('_')) {
                setWin(true);
                setGameOver(true);
            } else if (wrongGuesses >= maxWrongGuesses) {
                setGameOver(true);
            }
        }
    }, [guessedLetters, wrongGuesses, secretWord]);

    // Get display word with guessed letters
    const getDisplayWord = () => {
        return secretWord
            .split('')
            .map(letter => guessedLetters.includes(letter) ? letter : '_')
            .join(' ');
    };

    // Handle guess
    const handleGuess = () => {
        if (!guess) {
            setMessage('Please enter a letter to guess.');
            return;
        }
        if (!/^[a-z]$/.test(guess)) {
            setMessage('Please enter a single lowercase letter.');
            setGuess('');
            return;
        }
        if (guessedLetters.includes(guess)) {
            setMessage('You already guessed that letter.');
            setGuess('');
            return;
        }

        const newGuessedLetters = [...guessedLetters, guess];
        setGuessedLetters(newGuessedLetters);

        if (secretWord.includes(guess)) {
            setMessage('Good guess!');
        } else {
            setWrongGuesses(prev => prev + 1);
            setMessage('Wrong guess!');
        }
        setGuess('');
    };

    // Handle category change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    // Handle guess input change
    const handleGuessChange = (e) => {
        setGuess(e.target.value.toLowerCase());
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    };

    // SVG Hangman drawing based on wrong guesses
    const renderHangman = () => {
        return (
            <svg width="200" height="250" viewBox="0 0 200 250" className="hangman-svg">
                {/* Gallows */}
                <line x1="10" y1="230" x2="150" y2="230" stroke="#8B4513" strokeWidth="4"/>
                <line x1="30" y1="230" x2="30" y2="20" stroke="#8B4513" strokeWidth="4"/>
                <line x1="30" y1="20" x2="120" y2="20" stroke="#8B4513" strokeWidth="4"/>
                <line x1="120" y1="20" x2="120" y2="50" stroke="#8B4513" strokeWidth="4"/>
                
                {/* Head */}
                {wrongGuesses >= 1 && (
                    <circle cx="120" cy="70" r="20" stroke="#333" strokeWidth="3" fill="none"/>
                )}
                
                {/* Body */}
                {wrongGuesses >= 2 && (
                    <line x1="120" y1="90" x2="120" y2="170" stroke="#333" strokeWidth="3"/>
                )}
                
                {/* Left arm */}
                {wrongGuesses >= 3 && (
                    <line x1="120" y1="120" x2="90" y2="140" stroke="#333" strokeWidth="3"/>
                )}
                
                {/* Right arm */}
                {wrongGuesses >= 4 && (
                    <line x1="120" y1="120" x2="150" y2="140" stroke="#333" strokeWidth="3"/>
                )}
                
                {/* Left leg */}
                {wrongGuesses >= 5 && (
                    <line x1="120" y1="170" x2="90" y2="200" stroke="#333" strokeWidth="3"/>
                )}
                
                {/* Right leg */}
                {wrongGuesses >= 6 && (
                    <line x1="120" y1="170" x2="150" y2="200" stroke="#333" strokeWidth="3"/>
                )}
                
                {/* Face details when game over */}
                {wrongGuesses >= 6 && (
                    <>
                        <circle cx="115" cy="65" r="2" fill="#333"/>
                        <circle cx="125" cy="65" r="2" fill="#333"/>
                        <path d="M 115 75 Q 120 80 125 75" stroke="#333" strokeWidth="2" fill="none"/>
                    </>
                )}
            </svg>
        );
    };

    return (
        <div className="App">
            <h1>🎯 Hangman Game</h1>

            {gameOver ? (
                <div className="game-over-message">
                    {win ? (
                        <h2 className="win">🎉 Congratulations! You guessed the word: <span className="secret-word">{secretWord}</span></h2>
                    ) : (
                        <h2 className="lose">💀 Game Over! The word was: <span className="secret-word">{secretWord}</span></h2>
                    )}
                    <div className="category-info">Category: {currentCategory}</div>
                    <button onClick={() => startGame('')} className="play-again-btn">🎮 Play Again</button>
                </div>
            ) : (
                <div className="game-area">
                    <div className="left-panel">
                        <div className="category-selection">
                            <label htmlFor="category-select">🎯 Choose a category:</label>
                            <select id="category-select" value={category} onChange={handleCategoryChange}>
                                <option value="">🎲 Random</option>
                                <option value="ANIMALS">🐾 Animals</option>
                                <option value="COUNTRIES">🌍 Countries</option>
                                <option value="FRUITS">🍎 Fruits</option>
                                <option value="SPORTS">⚽ Sports</option>
                            </select>
                            <button onClick={() => startGame(category)} className="start-btn">🚀 Start New Game</button>
                        </div>

                        <div className="hangman-container">
                            <div className="current-category">Category: {currentCategory}</div>
                            {renderHangman()}
                        </div>
                    </div>

                    <div className="right-panel">
                        <div className="word-display">
                            <div className="display-word">{getDisplayWord()}</div>
                            
                            <div className="game-stats">
                                <div className="stat-item">
                                    <div className="stat-label">Guessed Letters</div>
                                    <div className="stat-value">
                                        {guessedLetters.length > 0 
                                            ? guessedLetters.join(', ').toUpperCase()
                                            : 'None yet'
                                        }
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label">Wrong Guesses</div>
                                    <div className="stat-value">
                                        {wrongGuesses} / {maxWrongGuesses}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="guess-input">
                            <input
                                type="text"
                                maxLength="1"
                                value={guess}
                                onChange={handleGuessChange}
                                onKeyPress={handleKeyPress}
                                disabled={gameOver}
                                placeholder="?"
                                className="guess-field"
                            />
                            <button onClick={handleGuess} disabled={gameOver} className="guess-btn">
                                🎯 Guess
                            </button>
                        </div>

                        {message && (
                            <div className={`message ${message.includes('Wrong') || message.includes('Please') || message.includes('already') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

