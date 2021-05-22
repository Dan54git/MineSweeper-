'use strict'

// Global Variables
// Level Sizes Board
const BEGINNER = 4;
const BEGINNER_MINES = 2;
const MEDIUM = 8;
const MEDIUM_MINES = 12;
const EXPERT = 12;
const EXPERT_MINES = 30;

// EMOJIS
const MINE = '💣'
const OPEN = 'OPEN';
const EMPTY = '';
const FLAG = '🚩'

// Status of the game
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 2,
    secsPassed: 0
}


// Level
var gLevel = {
    SIZE: 4,
    MINES: 2
}

// Lives array 
var gLives;

// Time
var gStartTimer;
var gTimerIntervalId;

var emptyArray;
var isFirstClicked = true;

var gBoard;

function init() {
    resetLivesAndFace();
    gBoard = buildBoard()
    renderFlagsPlacement(gGame.markedCount)
    emptyArray = Array(gLevel.SIZE * gLevel.SIZE).fill(EMPTY);
    console.log('emptyArray', emptyArray);
    gGame.markedCount = gLevel.MINES;
    isFirstClicked = true;
    renderBoard(gBoard)
    gGame.isOn = true
    initTimer();
}

// Change the board size and game diffuclty
function gameLevel(elBtn) {
    switch (elBtn.innerText) {
        case 'Easy':
            gLevel.SIZE = BEGINNER;
            gLevel.MINES = BEGINNER_MINES;
            gGame.markedCount = BEGINNER_MINES
            break;
        case 'Medium':
            gLevel.SIZE = MEDIUM;
            gLevel.MINES = MEDIUM_MINES;
            gGame.markedCount = MEDIUM_MINES
            break;
        case 'Expert':
            gLevel.SIZE = EXPERT;
            gLevel.MINES = EXPERT_MINES;
            gGame.markedCount = EXPERT_MINES;
            break;
        default:
            break;
    }
    clearInterval(gTimerIntervalId);
    gTimerIntervalId = null
    init();
}

function buildBoard() {
    // Create the Matrix
    var board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Create a cell
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                i: i,
                j: j
            };
            // Add created cell to The game board
            board[i][j] = cell;
        }
    }
    return board;
}

// render board
function renderBoard(gBoard) {
    var selector = '.board'
    var strHTML = '';
    var className;
    var symbol;
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMarked) {
                symbol = FLAG;
            } else if (currCell.isMine && currCell.isShown) {
                symbol = MINE;
            } else if (currCell.minesAroundCount && currCell.isShown) {
                symbol = currCell.minesAroundCount;
            } else {
                symbol = EMPTY;
            }
            className = 'cell cell' + i + '-' + j;
            if (!currCell.isShown) {
                className += ' unchecked'
            }
            strHTML += `<td onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j},event)" class="${className}">${symbol} </td>\n`
        }
        strHTML += '</tr>\n'
    }
    // console.log(strHTML);
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// Left click
function cellClicked(elCell, i, j) {
    startTimer();
    var currCell = gBoard[i][j]
    if (currCell.isShown || currCell.isMarked || !gGame.isOn) return;
    // only if the currCell isnt shown and is not marked we can press
    currCell.isShown = true;
    elCell.classList.remove("unchecked");
    // To put the mines only after first click
    if (isFirstClicked) {
        randomizeMinesLocation(gBoard, gLevel.SIZE);
        setMinesNegsCount(gBoard);
        isFirstClicked = !isFirstClicked;
    }
    // If he pressed on a mine
    if (currCell.isMine) {
        gLives.pop();
        gGame.markedCount--;
        renderFlagsPlacement(gGame.markedCount)
        console.log('gGame.markedCount' , gGame.markedCount);
        console.log('lives.length', gLives.length);
        renderLivesPlacement(gLives.length);
        if (!gLives.length) {
            initializeLostGame(elCell);
            return;
        };
    }
    // If he pressed on zero mines around that square
    if (!currCell.minesAroundCount && !currCell.isMine) {
        expandShown(gBoard, elCell, i, j)
    }
    emptyArray.pop();
    console.log('emptyArray', emptyArray);
    renderBoard(gBoard);
    checkGameOver();
}

// Right click
function cellMarked(elCel, i, j, e) {
    startTimer();
    e.preventDefault();
    var currCell = gBoard[i][j]
    if (currCell.isShown || !gGame.isOn) return;
    // dom - change the elCel to Flag
    if (currCell.isMarked) {
        elCel.innerText = EMPTY;
        gGame.markedCount++;
        renderFlagsPlacement(gGame.markedCount)
        emptyArray.push(EMPTY)
        console.log('emptyArray', emptyArray);
    } else {
        elCel.innerText = FLAG;
        gGame.markedCount--;
        renderFlagsPlacement(gGame.markedCount)
        emptyArray.pop();
        console.log('emptyArray', emptyArray);
    }
    // modal - change the isMarked from true to false and vise versa
    currCell.isMarked = !currCell.isMarked
    console.log('gGame.markedCount ', gGame.markedCount);
    checkGameOver();
}

// Place the mines in a randomize posiotions
function randomizeMinesLocation(gBoard, size) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var iIdx = getRandomInt(0, size);
        var jIdx = getRandomInt(0, size);
        // To chekc about the fist click and to check not placing two bombs in the same location
        while (gBoard[iIdx][jIdx].isShown || gBoard[iIdx][jIdx].isMine) {
            iIdx = getRandomInt(0, size);
            jIdx = getRandomInt(0, size);
        }
        gBoard[iIdx][jIdx].isMine = true;
    }
}

// Initilize the numbers for each cell
function setMinesNegsCount(gBoard) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            setOneMineNegsCount(i, j, gBoard);
        }
    }
}

// Puts the numbers on the squares indicating the mines around him
function setOneMineNegsCount(cellI, cellJ, gBoard) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMine) gBoard[cellI][cellJ].minesAroundCount++;
        }
    }
}

// Game over when the empt array and the flags count (gGame.markedCount) equal to 0
function checkGameOver() {
    if ((!emptyArray.length && !gGame.markedCount) || allCellsShawn()) {
        clearInterval(gTimerIntervalId);
        gGame.isOn = false;
        var elFace = document.querySelector(".reset")
        elFace.innerText = '😎'
        renderMessage('You Win!')
        console.log('Win');
        return true;
    }
}

// Open all the cell around a cell that has 0 mines around him
function expandShown(gBoard, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            var currCell = gBoard[i][j];
            if (!currCell.isShown) {
                emptyArray.pop();
            }
            currCell.isShown = true;
            elCell.classList.remove("unchecked");
        }
    }
}

// start when losing a game
function initializeLostGame(elCell) {
    markMines(elCell);
    var elFace = document.querySelector(".reset")
    elFace.innerText = '🤯'
    renderMessage('You Lost! Game Over')
    console.log('You Lost! Game Over');
    clearInterval(gTimerIntervalId);
    gGame.isOn = false;
    renderBoard(gBoard);
}

// Mark and show all mines when lost a game
function markMines(elCell) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                currCell.isShown = true;
                elCell.classList.remove("unchecked");
            }
        }
    }
}

// Restart the game
function restart() {
    clearInterval(gTimerIntervalId);
    gTimerIntervalId = null
    init();
}

// When doing init. Reset the lives array the the smiley face
function resetLivesAndFace() {
    var elFace = document.querySelector(".reset")
    gLives = ['🧡', '🧡', '🧡']
    renderLivesPlacement(gLives.length);
    var elMessage = document.querySelector('.message')
    elMessage.style.visibility = 'hidden';
    elFace.innerText = '😀'
}

// Present the flag counter on the DOM
function renderFlagsPlacement(flagCounter) {
    var elSpan = document.querySelector('.flags-count span')
    elSpan.innerHTML = flagCounter;
}

// Present the lives counter on the DOM
function renderLivesPlacement(livesCounter) {
    var strHtml = ''
    var elSpan = document.querySelector('.lives span')
    for (var i = 0; i < livesCounter; i++) {
        strHtml += '🧡 '
    }
    elSpan.innerHTML = strHtml;
}

// Present the game over message acording to the state
function renderMessage(message) {
    var strHtml = message;
    var elMessage = document.querySelector('.message')
    elMessage.style.visibility = 'visible';
    elMessage.innerHTML = strHtml;
}

// A check for the begginer level in order for him to win
function allCellsShawn() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isShown) {
                return false;
            }
        }
    }
    return true;
}

