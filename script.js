var gofirst = false
var start;
var player = "X";
var AI = "O";
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];
const cells = document.querySelectorAll(".cell");




function game() {

    document.querySelector(".endgame").style.display = "none";

    start = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false)
    }
    if (!gofirst) {
        alert("You are playing as O")
        player = 'O';
        AI = 'X';
        turn(0, AI)
    } else {
        player = 'X'
        AI = 'O'
        alert("You are playing as X")
    }
}

function turnClick(square) {
    if (typeof start[square.target.id] == "number") {
        turn(square.target.id, player);
        checkTie()
        setTimeout(function() {
                if (!checkTie()) {
                    turn(bestSpot(), AI)
                }


            }, 100)
            //declareWinner("Tie Game!")
    }
}

function turn(squareId, player1) {
    //alert(squareId)
    start[squareId] = player1;
    document.getElementById(squareId).innerHTML = player1;

    let gameWon = checkWin(start, player1);
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, [])
    let gameWon = null
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player }
            break;
        }
    }
    return gameWon
}
document.getElementById("O").onclick = function() {
    gofirst = false;
    document.getElementById('intro').style.visibility = 'hidden';
    document.querySelector('table').style.visibility = 'visible'
    game();
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == player ? "blue" : "red"
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner(gameWon.player == player ? "You're a Cheater!" : "You Lose!")
}

function bestSpot() {
    return (minimax(start, AI).index);
}

function declareWinner(winner) {
    document.querySelector("#endgame").style.display = "block"
        //document.querySelector(".endgame").style.visibility = "visible"
    document.querySelector("#text").innerHTML = winner;
}

function emptySquares() {
    return start.filter(s => typeof s == "number");
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green"
            cells[i].removeEventListener("click", turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false
}
var fc = 0
var bestMove
var bestScore

function minimax(board, play) {
    var availSpots = emptySquares();
    if (checkWin(board, player)) {
        return { score: -10 };
    } else if (checkWin(board, AI)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 }
    }
    //Array with all possible moves
    var moves = []
    for (var i = 0; i < availSpots.length; i++) {
        //create move
        var move = {};
        move.index = board[availSpots[i]];
        board[availSpots[i]] = play
        if (play == AI) {
            var result = minimax(board, player);
            move.score = result.score // + move.score
                //alert(move.score)
        } else {
            var result = minimax(board, AI);
            move.score = result.score // + move.score;
        }
        board[availSpots[i]] = move.index

        moves.push(move);
    }

    if (play === AI) {
        bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {

            if (moves[i].score > bestScore && moves[i].score != -10) {
                bestScore = moves[i].score;
                bestMove = i
                    //alert(bestMove)
            }


        }
    } else {
        bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            const x = moves[i];
            if (x.score < bestScore && moves[i].score != 10) {
                bestScore = x.score;
                bestMove = i;
                //alert(bestMove)
            }
        }
    }

    return moves[bestMove]
}
setInterval(() => {
    document.getElementById("debug").innerHTML = `
<br>${bestMove} <br> ${bestScore} <br> ${fc}
`
    if (checkTie()) {
        declareWinner("Tie Game!")
    }
}, 1);

function reset() {
    start = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false)
    }
}