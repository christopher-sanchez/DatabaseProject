// Card and Game Data
let suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let dealerHand = [];
let playerHand = [];
let deck = [];

let playerScore = 0;
let dealerScore = 0;
let isGameOver = false;

// Coins and Betting Data
let playerCoins = 1000; // Starting coins
let currentBet = 100; // Default minimum bet

// Current user
let currentUser = null;

const dealerCardsEl = document.getElementById("dealer-cards");
const playerCardsEl = document.getElementById("player-cards");
const dealerScoreEl = document.getElementById("dealer-score");
const playerScoreEl = document.getElementById("player-score");
const resultMessageEl = document.getElementById("result-message");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const restartButton = document.getElementById("restart-button");
const loginArea = document.getElementById("login-area");
const gameArea = document.getElementById("game-area");

// Sign-Up/Login Elements
const signupUsername = document.getElementById("signup-username");
const loginUsername = document.getElementById("login-username");
const signupButton = document.getElementById("signup-button");
const loginButton = document.getElementById("login-button");
const welcomeMessage = document.getElementById("welcome-message");
const logoutButton = document.getElementById("logout-button");

// Betting Elements
const coinsAmountEl = document.getElementById("coins-amount");
const betAmountEl = document.getElementById("bet-amount");
const decreaseBetButton = document.getElementById("decrease-bet-button");
const increaseBetButton = document.getElementById("increase-bet-button");

// Leaderboard Elements
const leaderboardButton = document.getElementById("leaderboard-button");
const leaderboardPopup = document.getElementById("leaderboard-popup");
const leaderboardList = document.getElementById("leaderboard-list");
const closeLeaderboardButton = document.getElementById("close-leaderboard-button");

// Event listeners for betting
decreaseBetButton.addEventListener("click", decreaseBet);
increaseBetButton.addEventListener("click", increaseBet);
leaderboardButton.addEventListener("click", showLeaderboard);
closeLeaderboardButton.addEventListener("click", () => leaderboardPopup.style.display = "none");

// Add event listeners
signupButton.addEventListener("click", signUp);
loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", logout);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
restartButton.addEventListener("click", restartGame);

function signUp() {
    const username = signupUsername.value.trim();
    if (username) {
        localStorage.setItem("username", username);
        localStorage.setItem(`${username}-coins`, 1000); // Set initial coins to 1000 for new user
        alert(`Welcome, ${username}! You have signed up successfully.`);
        switchToLogin();
    } else {
        alert("Please enter a valid username to sign up.");
    }
}

function login() {
    const username = loginUsername.value.trim();
    const storedUsername = localStorage.getItem("username");

    if (username === storedUsername) {
        alert(`Welcome back, ${username}!`);
        currentUser = username;
        playerCoins = parseInt(localStorage.getItem(`${username}-coins`), 10) || 1000; // Load coins
        showGameArea(username);
    } else {
        alert("Incorrect username. Please try again or sign up first.");
    }
}

function logout() {
    localStorage.removeItem("username");
    hideGameArea();
    switchToSignUp();
    currentUser = null;
}

function switchToLogin() {
    document.getElementById("sign-up-section").classList.add("hidden");
    document.getElementById("login-section").classList.remove("hidden");
}

function switchToSignUp() {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("sign-up-section").classList.remove("hidden");
}

function showGameArea(username) {
    loginArea.classList.add("hidden");
    gameArea.classList.remove("hidden");
    welcomeMessage.innerText = `Welcome, ${username}!`;
    document.getElementById("welcome-section").classList.remove("hidden");
    updateCoinsDisplay();
    startGame();
}

function hideGameArea() {
    gameArea.classList.add("hidden");
    document.getElementById("welcome-section").classList.add("hidden");
    loginArea.classList.remove("hidden");
}

// Betting logic
function updateCoinsDisplay() {
    coinsAmountEl.innerText = playerCoins;
    betAmountEl.innerText = currentBet;
}

function decreaseBet() {
    if (currentBet - 100 > 0) {
        currentBet -= 100;
        updateCoinsDisplay();
    } else {
        alert("You can't bet negative coins dummy.")
    }
}

function increaseBet() {
    if (currentBet + 100 <= playerCoins) {
        currentBet += 100;
        updateCoinsDisplay();
    } else {
        alert("You don't have enough coins to increase the bet.");
    }
}

// Blackjack logic
function startGame() {
    deck = createDeck();
    shuffleDeck(deck);

    dealerHand = [drawCard(), drawCard()];
    playerHand = [drawCard(), drawCard()];

    updateScores();
    renderCards();
}

function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit: suit, value: value });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
    }
}

function drawCard() {
    return deck.pop();
}

function hit() {
    if (isGameOver) return;

    playerHand.push(drawCard());
    updateScores();
    renderCards();

    if (playerScore > 21) {
        endGame("You busted!", false);
    }
}

function stand() {
    if (isGameOver) return;

    while (dealerScore < 17) {
        dealerHand.push(drawCard());
        updateScores();
    }

    if (dealerScore > 21) {
        endGame("Dealer busted, you win!", true);
    } else if (playerScore > dealerScore) {
        endGame("You win!", true);
    } else if (playerScore < dealerScore) {
        endGame("Dealer wins!", false);
    } else {
        endGame("It's a tie!", null);
    }
}

function updateScores() {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    playerScoreEl.innerText = `Your Score: ${playerScore}`;
    dealerScoreEl.innerText = `Dealer's Score: ${dealerScore}`;
}

function calculateScore(hand) {
    let score = 0;
    let hasAce = false;

    hand.forEach(card => {
        if (card.value === "A") {
            hasAce = true;
            score += 11;
        } else if (["K", "Q", "J"].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });

    if (hasAce && score > 21) {
        score -= 10;
    }

    return score;
}

function renderCards() {
    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';

    dealerHand.forEach(card => {
        let cardEl = document.createElement("div");
        cardEl.innerText = `${card.value} of ${card.suit}`;
        dealerCardsEl.appendChild(cardEl);
    });

    playerHand.forEach(card => {
        let cardEl = document.createElement("div");
        cardEl.innerText = `${card.value} of ${card.suit}`;
        playerCardsEl.appendChild(cardEl);
    });
}

function endGame(message, playerWon) {
    isGameOver = true;
    resultMessageEl.innerText = message;
    hitButton.disabled = true;
    standButton.disabled = true;
    restartButton.classList.remove("hidden");

    // Adjust coins based on the outcome
    if (playerWon === true) {
        playerCoins += currentBet;
    } else if (playerWon === false) {
        playerCoins -= currentBet;
    }

    updateCoinsDisplay();
    savePlayerCoins();
}

function restartGame() {
    isGameOver = false;
    hitButton.disabled = false;
    standButton.disabled = false;
    resultMessageEl.innerText = '';
    restartButton.classList.add("hidden");

    dealerHand = [];
    playerHand = [];
    playerScore = 0;
    dealerScore = 0;

    startGame();
}

// Save player's coins to localStorage
function savePlayerCoins() {
    if (currentUser) {
        localStorage.setItem(`${currentUser}-coins`, playerCoins);
    }
}

// Show top 10 users by coins
function showLeaderboard() {
    leaderboardPopup.style.display = "block";

    let users = [];
    for (let key in localStorage) {
        if (key.endsWith('-coins')) {
            let username = key.replace('-coins', '');
            let coins = parseInt(localStorage.getItem(key), 10);
            users.push({ username, coins });
        }
    }

    users.sort((a, b) => b.coins - a.coins); // Sort by coins, descending

    // Show top 10 users
    leaderboardList.innerHTML = '';
    users.slice(0, 10).forEach(user => {
        let li = document.createElement("li");
        li.innerText = `${user.username}: ${user.coins} coins`;
        leaderboardList.appendChild(li);
    });
}
