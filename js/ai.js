//actual AI to get best moves

function depthSearchMed(depth, originalDepth, algo, a, b) {
  depth--

  var moves = shuffle(algo.moves())
  var yourTurn = depth % 2 == 0 ? true : false

  for (var i = 0; i < moves.length; i++) {
      algo.move(moves[i])

      if (depth > 0) {
          var min = yourTurn ? -Infinity : a
          var max = yourTurn ? b : Infinity
          var rating = depthSearchMed(depth, originalDepth, algo, min, max)

          if (yourTurn && rating < b) {
              b = rating
          } else if (!yourTurn && rating > a) {
              a = rating
          }

          if (yourTurn && a > b) {
              return b
          } else if (!yourTurn && b > a) {
              return a
          }
      } else {
          var currentGame = algo.fen()
          var rating = evaluateLocal(algo, side, currentGame)
          if (yourTurn && rating < b) {
              b = rating
          } else if (!yourTurn && rating > a) {
              a = rating
          }
      }

      algo.undo()
  }

  return yourTurn ? b : a
}

function getBestMove() {
  var moves = game.moves()
  var algo = new Chess(game.fen())
  var safestMove = ['', -Infinity]

  for (var i = 0; i < moves.length; i++) {
      algo.move(moves[i])

      var search = depthSearchMed(1, 1, algo, -Infinity, Infinity)
      if (search > safestMove[1]) safestMove = [moves[i], search]

      algo = new Chess(game.fen())
  }
  return safestMove
}

function depthSearch(depth, originalDepth, algo, totalEval, side, rootMove, currentSafest) {
  depth -= 1
  var moves = shuffle(algo.moves())

  var min = [100000, '']
  var max = [-100000, '']

  var safestMove = [-9999, '', -100000]
  var savedGame = algo.fen()

  //loop through all possible moves from current game position, and make them on dummy board
  for (var i = 0; i < moves.length; i++) {

      algo.move(moves[i])
      var fen = algo.fen()

      //if it is the first iteration, set root move
      if (depth + 1 == originalDepth) {
          //for if depth is only 1, just attack whenever possible
          if (originalDepth == 1) {
              var curEval = evaluateLocal(algo, side, fen)
              if (curEval > max[0]) {
                  max = [curEval, moves[i]]
              }
              algo = new Chess(savedGame)
              continue;
          }

          //otherwise dive and return best possible case
          var search = depthSearch(depth, originalDepth, algo, totalEval, side, moves[i], safestMove[0])
          var square = moves[i].length > 2 ? findTile(moves[i]) : moves[i]
          var possibleMoves = algo.moves({
              square: square
          }).length

          if (search[0] > safestMove[0] || (search[0] == safestMove[0] && possibleMoves > safestMove[2])) {
              safestMove = [search[0], moves[i], possibleMoves]
          }
      }
      //otherwise continue
      else if (depth > 0) {
          var search = depthSearch(depth, originalDepth, algo, totalEval, side, rootMove, currentSafest)
          //Alpha beta pruning
          if (search[0] < currentSafest) {
              return [-10000, '']
          }

          if (search[0] < min[0]) {
              min = [search[0], search[1]]
          }
      }
      //at last iteration, evaluate min
      else {
          var curEval = evaluateLocal(algo, side, fen)

          if (curEval < currentSafest && originalDepth % 2 == 0) {
              return min
          }
          if (curEval > max[0] && originalDepth % 2 != 0) {
              max = [curEval, rootMove]
          } else if (curEval < min[0]) {
              min = [curEval, rootMove]
          }
      }

      algo = new Chess(savedGame)
  }
  return originalDepth == 2 && depth == 0 ? min : originalDepth == 1 ? max : depth + 1 == originalDepth ? safestMove : depth > 0 ? min : max
}


//functions for the 6 local bots

function makeRandomMove() {
  var i = Math.round(Math.random() * game.moves().length)
  return game.moves()[i]
}

function chesterFunction() {
  var algo = new Chess(game.fen())

  var depth = depthSearch(1, 1, algo, evaluateLocal(algo, game.turn(), game.fen()), game.turn(), '', 1000, -1000)
  return depth[1]
}

function barleyFunction() {
  return getBestMove()[0]
}

function sanderFunction() {
  var algo = new Chess(game.fen())

  var depth = depthSearch(3, 3, algo, evaluateLocal(algo, game.turn(), game.fen()), game.turn(), '', 1000, -1000)
  return depth[1]
}

function homoFunction() {
  var algo = new Chess(game.fen())

  var depth = depthSearch(3, 3, algo, evaluateLocal(algo, game.turn(), game.fen()), game.turn(), '', 1000, -1000)
  return depth[1]
}