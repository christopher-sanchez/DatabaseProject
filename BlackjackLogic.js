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
let increasedBet = 0;
let decreasedBet = 0;
let confirmingBet = 0;

// Current user
let currentUser = null;

const dealerCardsEl = document.getElementById("dealer-cards");
const playerCardsEl = document.getElementById("player-cards");
const dealerScoreEl = document.getElementById("dealer-score");
const playerScoreEl = document.getElementById("player-score");
const resultMessageEl = document.getElementById("result-message");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const doublebutton = document.getElementById("double-button")
const splitbutton   = document.getElementById("split-button")
const surrenderbutton = document.getElementById("surrender-button");
const restartButton = document.getElementById("restart-button");
const getcoinsbutton = document.getElementById("getcoins-button")
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
const confirmBetButton = document.getElementById("confirm-bet-button");

// Leaderboard Elements
const leaderboardButton = document.getElementById("leaderboard-button");
const leaderboardPopup = document.getElementById("leaderboard-popup");
const leaderboardList = document.getElementById("leaderboard-list");
const closeLeaderboardButton = document.getElementById("close-leaderboard-button");

// Event listeners for betting
decreaseBetButton.addEventListener("click", decreaseBet);
increaseBetButton.addEventListener("click", increaseBet);
confirmBetButton.addEventListener("click", confirmBet);
leaderboardButton.addEventListener("click", showLeaderboard);
closeLeaderboardButton.addEventListener("click", () => leaderboardPopup.style.display = "none");

// Add event listeners
signupButton.addEventListener("click", signUp);
loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", logout);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
doublebutton.addEventListener("click", double);
splitbutton.addEventListener("click",split);
surrenderbutton.addEventListener("click",surrender);
restartButton.addEventListener("click", restartGame);
getcoinsbutton.addEventListener("click",getcoins)

function signUp() {
    const username = signupUsername.value.trim();
    if (localStorage.getItem("username") === username) {
        alert("If you are logging in, please use same username again.");
        switchToLogin();
    }
    else if (username) {
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

function confirmBet() {
    increaseBetButton.classList.add("hidden");
    decreaseBetButton.classList.add("hidden");
    confirmBetButton.classList.add("hidden");
    updateScores();
    renderCards();
    confirmingBet = 1;
    alert("Your bet has been made!");
}

// Blackjack logic
function startGame() {
    deck = createDeck();
    shuffleDeck(deck);

    dealerHand = [drawCard()];
    playerHand = [drawCard(), drawCard()];
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

    if (confirmingBet === 1) {
        playerHand.push(drawCard());
        updateScores();
        renderCards();

        if (playerScore > 21) {
            endGame("You busted!", false);
        }
    } else {
        alert("Confirm your bet first!");
    }
}
function double(){
    if (isGameOver) return;

    if (confirmingBet === 1) {
       
        if (playerCoins >= currentBet) {
            playerCoins -= currentBet; 
            currentBet *= 2;

            updateCoinsDisplay(); 
            
         
            playerHand.push(drawCard());
            updateScores();
            renderCards();
            if (playerScore >21){
                endGame("you lose!",false);
            }

            
            stand();
        } else {
            alert("You don't have enough coins to double down!");
        }
    } else {
        alert("Please confirm your bet before doubling down!");
    }

}
function split(){
    if (isGameOver) return;

    if (confirmingBet === 1) {
        if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
        
            if (playerCoins >= currentBet) {
        
                playerCoins -= currentBet; 
                updateCoinsDisplay(); 
                
              
                const secondHand = [playerHand.pop()]; 
                dealerHand.push(drawCard());
                
       
                playerHand.push(drawCard()); 
                secondHand.push(drawCard()); 

          
                renderCards();
                
             
                playSplitHands(playerHand, secondHand);
            } else {
                alert("You don't have enough coins to split!");
            }
        } else {
            alert("You can only split if you have two cards of the same value.");
        }
    } else {
        alert("Please confirm your bet before splitting!");
    }
}
function surrender(){
   endGame("you lose!",false);

}


function stand() {
    if (isGameOver) return;

    if (confirmingBet === 1) {
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
        }  else {
            endGame("It's a tie!", null);
        }
    } else {
        alert("CONFIRM! BET!");
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
    increaseBetButton.classList.remove("hidden");
    decreaseBetButton.classList.remove("hidden");
    confirmBetButton.classList.remove("hidden");

    

    dealerHand = [];
    playerHand = [];
    playerScore = 0;
    dealerScore = 0;
    confirmingBet = 0;
    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';
    playerScoreEl.innerText = `Your Score: ${playerScore}`;
    dealerScoreEl.innerText = `Dealer's Score: ${dealerScore}`;
    startGame();
}


function savePlayerCoins() {
    if (currentUser) {
        localStorage.setItem(`${currentUser}-coins`, playerCoins);
    }
}

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

    users.sort((a, b) => b.coins - a.coins); 


    leaderboardList.innerHTML = '';
    users.slice(0, 10).forEach(user => {
        let li = document.createElement("li");
        li.innerText = `${user.username}: ${user.coins} coins`;
        leaderboardList.appendChild(li);
    });


}
function getcoins(){
     
     const coinsPerCorrectAnswer = 100;

     const num1 = Math.floor(Math.random() * 20) + 1;
     const num2 = Math.floor(Math.random() * 20) + 1;
     const operations = ['+', '-', '*'];
     const randomOperation = operations[Math.floor(Math.random() * operations.length)];
 
     let correctAnswer;
     switch (randomOperation) {
         case '+':
             correctAnswer = num1 + num2;
             break;
         case '-':
             correctAnswer = num1 - num2;
             break;
         case '*':
             correctAnswer = num1 * num2;
             break;
     }
 
     
     const playerAnswer = parseInt(prompt(`Solve: ${num1} ${randomOperation} ${num2}`), 10);
 
     if (playerAnswer === correctAnswer) {
         playerCoins += coinsPerCorrectAnswer;
         alert(`Correct! You earned ${coinsPerCorrectAnswer} coins.`);
     } else {
         alert(`Incorrect. The correct answer was ${correctAnswer}. Try again!`);
     }
 
    
     updateCoinsDisplay();
 }


