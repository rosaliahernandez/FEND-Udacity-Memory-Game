/* General Globals */
const deck = document.querySelector('.deck');
let toggledCards = []; // store all cards in an array
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;

/* Shuffling, utilize the shuffle method that was provided. */

 function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
 }
 shuffleDeck();

/* Shuffle function from http://stackoverflow.com/a/2450976, this was provided */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//This is the event listener
 deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) {
            checkForMatch();
            addMove();
            checkScore();
        }
    }
 });

/*Function to check that target doesnt contain class "card" & match", not more than 2 cards */
function isClickValid(clickTarget) {
    return (
            clickTarget.classList.contains('card') && 
            !clickTarget.classList.contains('match') &&
            toggledCards.length < 2 &&
            !toggledCards.includes(clickTarget)
        );
}

/* Clock functionality */
function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

/* Displays the current time in the scoreboard  */
function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

/* Function to toggle cards  */
function toggleCard(card){
    card.classList.toggle('open');
    card.classList.toggle('show');
 }

/* Function to push clickTarget into toggleCards array  */
function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}
 
/* Function to check if the cards match  */
function checkForMatch() {
    const TOTAL_PAIRS = 8;
    if (
        toggledCards[0].firstElementChild.className === 
        toggledCards[1].firstElementChild.className
        ) { // Toggle match class
            toggledCards[0].classList.toggle('match');
            toggledCards[1].classList.toggle('match'); 
            toggledCards = [];
            matched++; 
            if (matched === TOTAL_PAIRS) {
                gameOver();
            }

    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
    }, 1000);
    }
}
/* game over function  */
function gameOver() {
    stopClock();
    toggleModal();
    writeModalStats();   
}

/* Stops the clock  */
function stopClock() {
    clearInterval(clockId);
}

/*Congratulations Popup--When a user wins the game, a modal appears to congratulate the player and ask if they want to play again. It should also tell the user how much time it took to win the game, and what the star rating was*/

function toggleModal() {
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const moveStat = document.querySelector('.modal_moves');
    const starStat = document.querySelector('.modal_stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    moveStat.innerHTML = `Moves = ${moves}`;
    starStat.innerHTML = `Stars = ${stars}`;
}

/*Stars-- counts moves for scoreboard, determines the number of stars and displays*/
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function checkScore() {
    if (moves === 18 || moves === 27) {
        hideStar();
    }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

/*Popup buttons- event listener*/

document.querySelector('.modal_cancel').addEventListener('click' , () => {
    toggleModal();
});

document.querySelector('.modal_replay').addEventListener('click' , replayGame);

function replayGame() {
    resetGame();
    toggleModal();
}


//*Replay button*//
document.querySelector('.modal_replay').addEventListener('click' , replayGame);

function replayGame() {
    resetGame();
    toggleModal();
}


//*Restart button*//
document.querySelector('.restart').addEventListener('click' , resetGame);

function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
    resetCards();
}
function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}


document.querySelector('.restart').addEventListener('click' , resetGame);

function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
    resetCards();
}
function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

