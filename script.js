const wordDisplay = document.querySelector('.word-display');
const guessesText = document.querySelector('.guesses-text b');
const wrongLettersText = document.querySelector('.wrong-letters b');
const hintText = document.querySelector('.hint-text b');
const resetButton = document.querySelector('.reset-button');
const gameContainer = document.querySelector('.game-container');
const modalOverlay = document.getElementById('result-modal');
const modalImage = document.getElementById('result-image');
const modalTitle = document.getElementById('result-title');
const modalMessage = document.getElementById('result-message');
const playAgainButton = document.querySelector('.play-again-button');

const wordLevels = {
    easy: [
        { word: "html", hint: "Markup language for web pages" },
        { word: "css", hint: "Stylesheet language for styling web pages" },
        { word: "java", hint: "Widely-used object-oriented language" },
        { word: "ruby", hint: "Dynamic language known for its elegance" },
        { word: "php", hint: "Server-side scripting language" },
        { word: "sql", hint: "Language for managing databases" },
        { word: "perl", hint: "General-purpose interpreted language" },
        { word: "vue", hint: "Progressive JS framework" },
        { word: "git", hint: "Version control system" },
        { word: "api", hint: "Interface for software communication" },
        { word: "json", hint: "Lightweight data-interchange format" },
        { word: "ajax", hint: "Asynchronous web technique" },
        { word: "icon", hint: "Small graphical representation" },
        { word: "link", hint: "Connection between web resources" },
        { word: "byte", hint: "Unit of digital information (8 bits)" },
    ],
    medium: [
        { word: "python", hint: "Popular high-level language" },
        { word: "react", hint: "JavaScript library for UIs" },
        { word: "swift", hint: "Apple's language for iOS/macOS" },
        { word: "kotlin", hint: "Language often used for Android dev" },
        { word: "node", hint: "JavaScript runtime environment" },
        { word: "docker", hint: "Platform for containerization" },
        { word: "linux", hint: "Open-source operating system kernel" },
        { word: "jquery", hint: "Fast, small JavaScript library" },
        { word: "angular", hint: "Platform for web applications" },
        { word: "debug", hint: "Finding and fixing errors in code" },
        { word: "array", hint: "Ordered collection of elements" },
        { word: "class", hint: "Blueprint for creating objects (OOP)" },
        { word: "server", hint: "Computer providing data to clients" },
        { word: "client", hint: "Computer requesting data from a server" },
        { word: "module", hint: "Self-contained unit of software" },
    ],
    hard: [
        { word: "javascript", hint: "Language for web interactivity" },
        { word: "assembly", hint: "Low-level programming language" },
        { word: "typescript", hint: "Typed superset of JavaScript" },
        { word: "bootstrap", hint: "Popular front-end framework" },
        { word: "algorithm", hint: "Step-by-step procedure for calculations" },
        { word: "framework", hint: "Reusable set of libraries/classes" },
        { word: "database", hint: "Organized collection of data" },
        { word: "compiler", hint: "Program that translates source code" },
        { word: "variable", hint: "Named storage location for data" },
        { word: "function", hint: "Block of code designed to perform a task" },
        { word: "recursion", hint: "Function calling itself" },
        { word: "interface", hint: "Contract defining methods/properties" },
        { word: "asynchronous", hint: "Operations running independently of main flow" },
        { word: "polymorphism", hint: "Objects taking on many forms (OOP)" },
        { word: "inheritance", hint: "Class deriving properties from another (OOP)" },
    ]
};

let currentWordData, correctLetters, wrongLettersCount;
const maxGuesses = 6;
let selectedLevel = "medium"; // Default level, can be changed by UI elements later

const resetGame = () => {
    correctLetters = [];
    wrongLettersCount = 0;

    let currentLevelList = wordLevels[selectedLevel];
    if (!currentLevelList || currentLevelList.length === 0) {
        console.error("Invalid or empty level selected:", selectedLevel, ". Defaulting to medium.");
        selectedLevel = "medium"; // Fallback
        currentLevelList = wordLevels[selectedLevel];
    }

    currentWordData = currentLevelList[Math.floor(Math.random() * currentLevelList.length)];
    const word = currentWordData.word;

    wordDisplay.innerHTML = word.split("").map(() => `<li class="letter"></li>`).join("");
    hintText.innerText = currentWordData.hint;
    guessesText.innerText = `${maxGuesses}`;
    wrongLettersText.innerText = "";
    modalOverlay.classList.remove('show');
    gameContainer.classList.remove('shake');

    document.removeEventListener("keydown", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
};

const handleKeyPress = (e) => {
    const key = e.key.toLowerCase();

    if (key.match(/^[a-z]$/) &&
        !correctLetters.includes(key) &&
        !wrongLettersText.innerText.includes(key)) {

        const word = currentWordData.word;

        if (word.includes(key)) {
            [...word].forEach((letter, index) => {
                if (letter === key) {
                    if (!correctLetters.includes(key)){
                         // Add only if it's the first time guessing this correct letter
                         // Needed because a word might have duplicate letters
                         // We check length against unique letters, but need to track all occurrences
                    }
                    // Always add to correctLetters to track progress towards win condition based on unique letters
                    correctLetters.push(key);
                    const letterElement = wordDisplay.querySelectorAll("li")[index];
                    letterElement.innerText = letter;
                    letterElement.classList.add("guessed");
                }
            });
        } else {
            wrongLettersCount++;
            wrongLettersText.innerText += (wrongLettersText.innerText ? ", " : "") + key;
            gameContainer.classList.add('shake');
            setTimeout(() => gameContainer.classList.remove('shake'), 300);
        }

        guessesText.innerText = `${maxGuesses - wrongLettersCount}`;
        checkGameStatus();
    }
};

const checkGameStatus = () => {
    const uniqueLettersInWord = [...new Set(currentWordData.word)];
    const uniqueCorrectLetters = [...new Set(correctLetters)]; // Count unique correct letters guessed

    if (uniqueCorrectLetters.length === uniqueLettersInWord.length) {
        showModal(true);
    } else if (wrongLettersCount >= maxGuesses) {
        showModal(false);
    }
};


const showModal = (isVictory) => {
    if (isVictory) {
        modalImage.src = "https://img.icons8.com/plasticine/100/trophy.png";
        modalTitle.innerText = "Congratulations!";
        modalMessage.innerHTML = `You found the word: <b>${currentWordData.word.toUpperCase()}</b>`;
    } else {
        modalImage.src = "https://img.icons8.com/plasticine/100/sad.png";
        modalTitle.innerText = "Game Over!";
        modalMessage.innerHTML = `The correct word was: <b>${currentWordData.word.toUpperCase()}</b>`;
    }
    modalOverlay.classList.add('show');
    document.removeEventListener("keydown", handleKeyPress);
};


// Function to allow changing level (example, needs HTML buttons or dropdown to trigger it)
const setLevel = (level) => {
    if (wordLevels[level]) {
        selectedLevel = level;
        console.log(`Level set to: ${selectedLevel}`);
        resetGame(); // Start a new game with the new level
    } else {
        console.error("Attempted to set invalid level:", level);
    }
};


resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);


resetGame(); // Initialize the game on page load