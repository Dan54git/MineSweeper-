'use strict'


// Level Sizes Board
const BEGINNER = 4;
const BEGINNER_MINES = 2;
const MEDIUM = 8;
const MEDIUM_MINES = 8;
const EXPERT = 12;
const EXPERT_MINES = 12;

// EMOJIS
const MINE = '💣'
const OPEN = 'OPEN';
const EMPTY = '';
const FLAG = '🚩'

// Status of the game
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const CLASS_SELECTOR = '.board-container'

// Level
var gLevel = {
    SIZE: BEGINNER,
    MINES: BEGINNER_MINES
}

var gBoard;

function init() {
    console.log('hello')
    gBoard = buildBoard()
    randomizeMinesLocation(gBoard, gLevel.SIZE)
    setMinesNegsCount(gBoard)
    console.table(gBoard);
    renderBoard(gBoard)
    gGame.isOn = true
}





function buildBoard() {
    // Create the Matrix
    var board = createMat(BEGINNER, BEGINNER)


    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
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

    // Place the Mines (currently randomly chosen positions)
    // board[2][2].isMine = true;
    // board[1][1].isMine = true;

    return board;
}



function randomizeMinesLocation(gBoard, size) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var iIdx = getRandomInt(0, size);
        var jIdx = getRandomInt(0, size);
        gBoard[iIdx][jIdx].isMine = true;
    }
}


function setMinesNegsCount(gBoard) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            setOneMineNegsCount(i, j, gBoard);
        }
    }
}

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


function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (currCell.isShown || currCell.isMarked) return;
    elCell.classList.remove("unchecked");
    gBoard[i][j].isShown = true;
    renderBoard(gBoard)
}


function cellMarked(elCel, i, j, e) {
    e.preventDefault();
    var currCell = gBoard[i][j]
    if (currCell.isShown) return;
    elCel.innerText = currCell.isMarked ? EMPTY : FLAG;
    currCell.isMarked = !currCell.isMarked
}


window.addEventListener('contextmenu', function (e) {
    // do something here... 
    e.preventDefault();
}, false);

// const elContext = document.querySelectorAll(".cell")
// elContext.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
// },false)