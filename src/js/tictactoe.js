$(document).ready(function() {
  var playerTurn;
  var playerIcon;
  var aiIcon;
  var playerTurn;
  var gameOver = false;
  var count = 0;
  var playerColor;
  var aiColor;
  var boardArray = [0, 1, 2,
                    3, 4, 5,
                    6, 7, 8
                    ];

  $("td").click(function() {
    if ($(this).is(":empty") && !gameOver && playerTurn) {
      $(this).html(playerIcon).css("color", playerColor);
      boardArray[$(this).attr("id")] = playerIcon;
      count++;
      playerTurn = !playerTurn;
      if (checkWinner(boardArray, playerIcon)) {
        setTimeout(function() {
          gameFinished("You win!");
        }, 200);
      } else if (count === 9) {
        setTimeout(function() {
          gameFinished("It's a tie!");
        }, 200);
      } else {
        $("#aiTurnMessage, #playerTurnMessage").toggleClass("hidden");
        aiTurn();
      }
    }
  });

  $("button#reset").click(function() {
    resetBoard();
  });

  $("span#X").click(function() {
    playerIcon = "X";
    playerColor = "#9FFFF5";
    aiIcon = "O";
    aiColor = "#9AC4F8";
    $("button#reset").text("Reset");
    $("#popup, #reset").toggleClass("hidden");
    setTimeout(function() {
      coinflip();
    }, 1);
  });

  $("span#O").click(function() {
    playerIcon = "O";
    playerColor = "#9AC4F8";
    aiIcon = "X";
    aiColor = "#9FFFF5";
    $("button#reset").text("Reset");
    $("#popup, #reset").toggleClass("hidden");
    setTimeout(function() {
      coinflip();
    }, 1);
  });

  function resetBoard() {
    $("#reset").toggleClass("hidden");
    $("#aiTurnMessage, #playerTurnMessage").addClass("hidden");
    setTimeout(function() {
      $("span#gameStatus").addClass("hidden");
      $("#popup").toggleClass("hidden");
      $("td").empty();
      $("table").removeClass("translucent");
      boardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      count = 0;
      gameOver = false;
    }, 200);
  }

  function gameFinished(message) {
    $("#aiTurnMessage, #playerTurnMessage").addClass("hidden");
    $("span#gameStatus").text(message).removeClass("hidden");
    $("button#reset").text("Play again?");
    $("table").addClass("translucent");
    gameOver = true;
  }

  function coinflip() {
    var num = Math.floor(Math.random() * 2);
    if (num === 0) {
      $("#aiTurnMessage").toggleClass("hidden");
      playerTurn = false;
      aiTurn();
    } else {
      playerTurn = true;
      $("#playerTurnMessage").toggleClass("hidden");
    }
  }

  function emptySpots(board) {
    var arr = board.filter(function(i) {
      return typeof(i) === "number";
    });
    return arr;
  }

  function checkWinner(board, player) {
    if (board[0] === player && board[1] === player && board[2] === player || board[3] === player && board[4] === player && board[5] === player || board[6] === player && board[7] === player && board[8] === player || board[0] === player && board[3] === player && board[6] === player || board[1] === player && board[4] === player && board[7] === player || board[2] === player && board[5] === player && board[8] === player || board[0] === player && board[4] === player && board[8] === player || board[2] === player && board[4] === player && board[6] === player) {
      return true;
    } else {
      return false;
    }
  }

  function aiTurn() {
    setTimeout(function() {
      var aiSpot = minimax(boardArray, aiIcon);
      boardArray[aiSpot.index] = aiIcon;
      $("td#" + aiSpot.index).html(aiIcon).css("color", aiColor);
      count++;
      $("#aiTurnMessage, #playerTurnMessage").toggleClass("hidden");
      playerTurn = !playerTurn;
      if (checkWinner(boardArray, aiIcon)) {
        setTimeout(function() {
          gameFinished("You lose!");
        }, 200);
      } else if (count === 9) {
        setTimeout(function() {
          gameFinished("It's a tie!");
        }, 200);
      }
    }, 500);
  }

  function minimax(newBoard, player) {
    //Stores empty board spaces into variable
    var availSpaces = emptySpots(newBoard);

    //Returns score based on value of position
    if (checkWinner(newBoard, playerIcon)) {
      return {
        score: -10
      };
    } else if (checkWinner(newBoard, aiIcon)) {
      return {
        score: 10
      };
    } else if (availSpaces.length === 0) {
      return {
        score: 0
      };
    }
    //Array to loop through available moves
    var moves = [];
    //Loops through empty spaces and adds index to object
    for (var i = 0; i < availSpaces.length; i++) {
      var move = {};
      //Adds index to object
      move.index = newBoard[availSpaces[i]];
      //Assigns ai/player icon to postion
      newBoard[availSpaces[i]] = player;

      if (player === aiIcon) {
        //runs minimax recursion as opposite player
        var result = minimax(newBoard, playerIcon);
        move.score = result.score;
      } else {
        var result = minimax(newBoard, aiIcon);
        move.score = result.score;
      }
      //Changes array index back to index number
      newBoard[availSpaces[i]] = move.index;
      //Pushes the index and value to moves array
      moves.push(move);

    }

    var bestMove;
    //Loops through array to find highest value position and stores it to variable
    if (player === aiIcon) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
      //Loops through array to find lowest value position and stores it to variable
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    //returns best move
    return moves[bestMove];
  }

});