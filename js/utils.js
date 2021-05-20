'use strict'

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


  // location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }



  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }


  function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);
  
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
  }
  
  
  function drawNum(emptyCells) {
    return emptyCells.pop()
  }


  function initTimer() {
    var elTimer = document.getElementById('timer');
    elTimer.innerText = '00 : 00';
  }
  
  function startTimer() {
    if (!gTimerIntervalId) {
      gStartTimer = getTime();
      gTimerIntervalId = setInterval(renderTimer, 10);
    }
  }
  
  function getTime() {
    return Date.now();
  }
  
  function renderTimer() {
    var delta = getTime() - gStartTimer;
    var time = timeFormatter(delta);
    var elTimer = document.getElementById('timer');
    elTimer.innerText = time;
  }
  
  function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();
  
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
  
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
  
    while (milliseconds.length < 3) {
      milliseconds = '0' + milliseconds;
    }
  
    return minutes + ' : ' + seconds;
  }