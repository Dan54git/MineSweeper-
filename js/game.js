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
    randomizeMinesLocation(gBoard,gLevel.SIZE)
    setMinesNegsCount(gBoard)
    console.table(gBoard);
    renderBoard(gBoard, CLASS_SELECTOR)
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
                isMarked: true,
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



function randomizeMinesLocation(gBoard,size) {
    for(var i = 0; i < gLevel.MINES; i++) {
        var iIdx = getRandomInt(0,size); 
        var jIdx = getRandomInt(0,size); 
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

function renderBoard(gBoard) {
    var selector = '.board-container'
    var strHTML = '<table border="1" cellpadding="10"><tbody class="board">\n';
    var className;
    var symbol;
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if(cell.isMine){
                symbol = MINE;
            } else if(cell.minesAroundCount) {
                symbol = cell.minesAroundCount;
            } else {
                symbol = ''
            }
            if (!cell.isShown) {
                className = 'cell cell' + i + '-' + j + ' unchecked';
                // const elContext = document.querySelector('cell cell' + i + '-' + j + ' unchecked');
                // console.log(elContext);
                // elContext.addEventListener("click" , handleClick)
                strHTML += `<td onclick="cellClicked(this,${i},${j})" class="${className}"> </td>\n`
            } else {
                className = 'cell cell' + i + '-' + j;
                strHTML += `<td onclick="cellClicked(this,${i},${j})"  class="${className}">${symbol} </td>\n`
            }
        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>';
    // console.log(strHTML);
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function handleClick() {
    alert("I got clicked!")
}

function cellClicked(elCell, i, j) {
    // elCell.classList.remove('unchecked')
    // console.log('i', i, ' j ', j);
    // setMinesNegsCount(i, j, gBoard)
    // console.log('gBoard[i][j].minesAroundCount ', gBoard[i][j].minesAroundCount);
    console.log(elCell);
    gBoard[i][j].isShown = true;
    renderBoard(gBoard)
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






// window.addEventListener('contextmenu', function (e) { 
//     // do something here... 
//     e.preventDefault(); 
//   }, false);

// const elContext = document.querySelectorAll(".cell")
// elContext.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
// },false)