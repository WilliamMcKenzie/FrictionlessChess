var board = null
var game = new Chess()
var fenEle = document.getElementById("fen")
var moveHistory = []
var currentMoveIndex = 0

const pieceVal = { 'p': 100, 'n': 280, 'b': 320, 'r': 479, 'q': 929, 'k': 60000, 'P' : -100, 'N' : -280, 'B' : -320, 'R' : -479, 'Q' : -929, 'K' : -60000}

var pst_w = {
  'p':[
          [ 100, 100, 100, 100, 105, 100, 100,  100],
          [  78,  83,  86,  73, 102,  82,  85,  90],
          [   7,  29,  21,  44,  40,  31,  44,   7],
          [ -17,  16,  -2,  15,  14,   0,  15, -13],
          [ -26,   3,  10,   9,   6,   1,   0, -23],
          [ -22,   9,   5, -11, -10,  -2,   3, -19],
          [ -31,   8,  -7, -37, -36, -14,   3, -31],
          [   0,   0,   0,   0,   0,   0,   0,   0]
      ],
  'n': [ 
          [-66, -53, -75, -75, -10, -55, -58, -70],
          [ -3,  -6, 100, -36,   4,  62,  -4, -14],
          [ 10,  67,   1,  74,  73,  27,  62,  -2],
          [ 24,  24,  45,  37,  33,  41,  25,  17],
          [ -1,   5,  31,  21,  22,  35,   2,   0],
          [-18,  10,  13,  22,  18,  15,  11, -14],
          [-23, -15,   2,   0,   2,   0, -23, -20],
          [-74, -23, -26, -24, -19, -35, -22, -69]
      ],
  'b': [ 
          [-59, -78, -82, -76, -23,-107, -37, -50],
          [-11,  20,  35, -42, -39,  31,   2, -22],
          [ -9,  39, -32,  41,  52, -10,  28, -14],
          [ 25,  17,  20,  34,  26,  25,  15,  10],
          [ 13,  10,  17,  23,  17,  16,   0,   7],
          [ 14,  25,  24,  15,   8,  25,  20,  15],
          [ 19,  20,  11,   6,   7,   6,  20,  16],
          [ -7,   2, -15, -12, -14, -15, -10, -10]
      ],
  'r': [  
          [ 35,  29,  33,   4,  37,  33,  56,  50],
          [ 55,  29,  56,  67,  55,  62,  34,  60],
          [ 19,  35,  28,  33,  45,  27,  25,  15],
          [  0,   5,  16,  13,  18,  -4,  -9,  -6],
          [-28, -35, -16, -21, -13, -29, -46, -30],
          [-42, -28, -42, -25, -25, -35, -26, -46],
          [-53, -38, -31, -26, -29, -43, -44, -53],
          [-30, -24, -18,   5,  -2, -18, -31, -32]
      ],
  'q': [   
          [  6,   1,  -8,-104,  69,  24,  88,  26],
          [ 14,  32,  60, -10,  20,  76,  57,  24],
          [ -2,  43,  32,  60,  72,  63,  43,   2],
          [  1, -16,  22,  17,  25,  20, -13,  -6],
          [-14, -15,  -2,  -5,  -1, -10, -20, -22],
          [-30,  -6, -13, -11, -16, -11, -16, -27],
          [-36, -18,   0, -19, -15, -15, -21, -38],
          [-39, -30, -31, -13, -31, -36, -34, -42]
      ],
  'k': [  
          [  4,  54,  47, -99, -99,  60,  83, -62],
          [-32,  10,  55,  56,  56,  55,  10,   3],
          [-62,  12, -57,  44, -67,  28,  37, -31],
          [-55,  50,  11,  -4, -19,  13,   0, -49],
          [-55, -43, -52, -28, -51, -47,  -8, -50],
          [-47, -42, -43, -79, -64, -32, -29, -32],
          [ -4,   3, -14, -50, -57, -18,  13,   4],
          [ 17,  30,  -3, -14,   6,  -1,  40,  18]
    ]
};

var pst_b = {
  'p': pst_w['p'].slice().reverse(),
  'n': pst_w['n'].slice().reverse(),
  'b': pst_w['b'].slice().reverse(),
  'r': pst_w['r'].slice().reverse(),
  'q': pst_w['q'].slice().reverse(),
  'k': pst_w['k'].slice().reverse()
}

var positionMap = {
  'p':[
          [ 100, 100, 100, 100, 105, 100, 100,  100],
          [  78,  83,  86,  73, 102,  82,  85,  90],
          [   7,  29,  21,  44,  40,  31,  44,   7],
          [ -17,  16,  -2,  15,  14,   0,  15, -13],
          [ -26,   3,  10,   9,   6,   1,   0, -23],
          [ -22,   9,   5, -11, -10,  -2,   3, -19],
          [ -31,   8,  -7, -37, -36, -14,   3, -31],
          [   0,   0,   0,   0,   0,   0,   0,   0]
      ],
  'n': [ 
          [-66, -53, -75, -75, -10, -55, -58, -70],
          [ -3,  -6, 100, -36,   4,  62,  -4, -14],
          [ 10,  67,   1,  74,  73,  27,  62,  -2],
          [ 24,  24,  45,  37,  33,  41,  25,  17],
          [ -1,   5,  31,  21,  22,  35,   2,   0],
          [-18,  10,  13,  22,  18,  15,  11, -14],
          [-23, -15,   2,   0,   2,   0, -23, -20],
          [-74, -23, -26, -24, -19, -35, -22, -69]
      ],
  'b': [ 
          [-59, -78, -82, -76, -23,-107, -37, -50],
          [-11,  20,  35, -42, -39,  31,   2, -22],
          [ -9,  39, -32,  41,  52, -10,  28, -14],
          [ 25,  17,  20,  34,  26,  25,  15,  10],
          [ 13,  10,  17,  23,  17,  16,   0,   7],
          [ 14,  25,  24,  15,   8,  25,  20,  15],
          [ 19,  20,  11,   6,   7,   6,  20,  16],
          [ -7,   2, -15, -12, -14, -15, -10, -10]
      ],
  'r': [  
          [ 35,  29,  33,   4,  37,  33,  56,  50],
          [ 55,  29,  56,  67,  55,  62,  34,  60],
          [ 19,  35,  28,  33,  45,  27,  25,  15],
          [  0,   5,  16,  13,  18,  -4,  -9,  -6],
          [-28, -35, -16, -21, -13, -29, -46, -30],
          [-42, -28, -42, -25, -25, -35, -26, -46],
          [-53, -38, -31, -26, -29, -43, -44, -53],
          [-30, -24, -18,   5,  -2, -18, -31, -32]
      ],
  'q': [   
          [  6,   1,  -8,-104,  69,  24,  88,  26],
          [ 14,  32,  60, -10,  20,  76,  57,  24],
          [ -2,  43,  32,  60,  72,  63,  43,   2],
          [  1, -16,  22,  17,  25,  20, -13,  -6],
          [-14, -15,  -2,  -5,  -1, -10, -20, -22],
          [-30,  -6, -13, -11, -16, -11, -16, -27],
          [-36, -18,   0, -19, -15, -15, -21, -38],
          [-39, -30, -31, -13, -31, -36, -34, -42]
      ],
  'k': [  
          [  4,  54,  47, -99, -99,  60,  83, -62],
          [-32,  10,  55,  56,  56,  55,  10,   3],
          [-62,  12, -57,  44, -67,  28,  37, -31],
          [-55,  50,  11,  -4, -19,  13,   0, -49],
          [-55, -43, -52, -28, -51, -47,  -8, -50],
          [-47, -42, -43, -79, -64, -32, -29, -32],
          [ -4,   3, -14, -50, -57, -18,  13,   4],
          [ 17,  30,  -3, -14,   6,  -1,  40,  18]
    ]
};
positionMap['P'] = positionMap['p'].slice().reverse()
positionMap['N'] = positionMap['n'].slice().reverse()
positionMap['B'] = positionMap['b'].slice().reverse()
positionMap['R'] = positionMap['r'].slice().reverse()
positionMap['Q'] = positionMap['q'].slice().reverse()
positionMap['K'] = positionMap['k'].slice().reverse()

var balance = 0
var selectedDepth = -1
var demonMode = false

function eval(gameToEval, side, fen){
  var total = 0
  var layout = fen.split(" ")[0]

  var posX = 0
  var posY = 0

  var positionValue = 0

  for(var digit of layout){
    if(pieceVal[digit]){
      positionValue += positionMap[digit][posX][posY]*(digit.toUpperCase() == digit ? -0.5 : 0.5)
      total += (pieceVal[digit]*(side == 'w' ? -1 : 1))
      posX++
    }
    else if(digit != '/'){
      posX++
    }else {
      posY++
      posX = 0
    }
  }
  return total+positionValue
}
var moveCount = 0

var side = 'b'
//demo call: depthSearch2(3, 3, game, -Infinity, Infinity)
//a = maximum of the minimum children
//b = minimum of the maximum children
function depthSearchMed(depth, originalDepth, algo, a, b){
  depth--
  var moves = shuffle(algo.moves())
  var yourTurn = depth % 2 == 0 ? true : false
  var savedGame = algo.fen()

  for(var i = 0; i < moves.length; i++){
    algo.move(moves[i])
    moveCount++

    if(depth > 0){
      var min = yourTurn ? -Infinity : a
      var max = yourTurn ? b : Infinity
      var rating = depthSearchMed(depth, originalDepth, algo, min, max)

      if(yourTurn && rating < b){
        b = rating
      }
      else if(!yourTurn && rating > a){
        a = rating
      }

      if(yourTurn && a > b){
        return b
      }
      else if(!yourTurn && b > a){
        return a
      }
    } 
    
    else {
      var currentGame = algo.fen()
      var rating = eval(algo, side, currentGame)
      if(yourTurn && rating < b){
        b = rating
      }
      else if(!yourTurn && rating > a){
        a = rating
      }
    }

    algo = new Chess(savedGame)
  }

  return yourTurn ? b : a
}

function getBestMove(){
  var moves = game.moves()
  var algo = new Chess(game.fen())
  var safestMove = ['', -Infinity]

  for(var i = 0; i < moves.length; i++){
    algo.move(moves[i])

    var search = depthSearchMed(selectedDepth-1, selectedDepth-1, algo, -Infinity, Infinity)
    if(search > safestMove[1]) safestMove = [moves[i], search]

    algo = new Chess(game.fen())
  }
  return safestMove
}

function depthSearch(depth, originalDepth, algo, totalEval, side, rootMove, currentSafest){
  depth -= 1
  var moves = shuffle(algo.moves())

  var min = [100000, '']
  var max = [-100000, '']

  var safestMove = [-9999, '', -100000]
  var savedGame = algo.fen()

  //loop through all possible moves from current game position, and make them on dummy board
  for(var i = 0; i < moves.length; i++){
    moveCount++

    algo.move(moves[i])
    var fen = algo.fen()

    //if it is the first iteration, set root move
    if(depth+1 == originalDepth){
      //for if depth is only 1, just attack whenever possible
      if(originalDepth == 1){
        var curEval = eval(algo, side, fen)
        if(curEval > max[0]){
          max = [curEval, moves[i]]
        }
        algo = new Chess(savedGame)
        continue;
      }

      //otherwise dive and return best possible case
      var search = depthSearch(depth, originalDepth, algo, totalEval, side, moves[i], safestMove[0])
      var square = moves[i].length > 2 ? findTile(moves[i]) : moves[i]
      var possibleMoves = algo.moves({ square: square }).length

      if(search[0] > safestMove[0] || (search[0] == safestMove[0] && possibleMoves > safestMove[2])){
        safestMove = [search[0], moves[i], possibleMoves]
      }
    }
    //otherwise continue
    else if(depth > 0){
      var search = depthSearch(depth, originalDepth, algo, totalEval, side, rootMove, currentSafest)
      //Alpha beta pruning
      if(search[0] < currentSafest){
        return [-10000, '']
      }
      
      if(search[0] < min[0]){
        min = [search[0], search[1]]
      }
    }
    //at last iteration, evaluate min
    else {
      var curEval = eval(algo, side, fen)
      
      if(curEval < currentSafest && originalDepth % 2 == 0){
        return min
      } 
      if(curEval > max[0] && originalDepth % 2 != 0){
        max = [curEval, rootMove]
      } 
      else if(curEval < min[0]) {
        min = [curEval, rootMove]
      }
    }

    algo = new Chess(savedGame)
  }
  return originalDepth == 2 && depth == 0 ? min : originalDepth == 1 ? max : depth+1 == originalDepth ? safestMove : depth > 0 ? min : max
}

function moveAI () {
  var possibleMoves = game.moves()
  var algo = new Chess(game.fen())

  var optimalMove

  if(selectedDepth == -1){
    var randomIdx = Math.floor(Math.random() * possibleMoves.length)
    optimalMove = possibleMoves[randomIdx]
  }
  else if(selectedDepth != 2 & selectedDepth != 4){
    var depth = depthSearch(selectedDepth, selectedDepth, algo, eval(algo, game.turn(), game.fen()), game.turn(), '', 1000, -1000)
    console.log(depth)
    optimalMove = depth[1]
  }
  else{
    optimalMove = getBestMove()[0]
  }

  game.move(optimalMove)
  board.position(game.fen())
  fenEle.value = game.fen()
  onMove()
  saySomething()

  // exit if the game is over
  if (game.game_over()){
    document.getElementById('face_speechbox').innerHTML = 'GG lousy CHIGGER!'
    document.getElementById('restart').style.visibility = 'visible'
    return
  } 
}


var isBotLoading = false
function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  return new Promise((resolve) => {
    animateMove(move, () => {
      // Update chessboard graphics
      board.position(game.fen())
      
      // Resolve the Promise to trigger AI move generation
      resolve();
    });
  });
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  moveAI()
  moveHistory.push(game.fen())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('board', config)

//for shuffling the possible moves, to get variation
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
function findTile(move){
  var res = ''
  for(var digit of move){
    if(digit.toUpperCase() != digit && digit != 'x'){
      res += digit
    }
  }
  return res
}
function onFenEdit(){
  game = new Chess(fenEle.value)
  board.position(game.fen())
}

function undo(){
  game = new Chess(moveHistory[moveHistory.length-2])
  console.log(moveHistory[moveHistory.length-2])
  moveHistory.pop()
  board.position(game.fen())
}
function reset(){
  game = new Chess()
  board.position(game.fen())
}
function onMove(){
  var scoreEle = document.getElementById('score')
  var score = eval(game, 'white', game.fen())/10
  scoreEle.innerHTML = ` White: ${score*-1} | Black: ${score*1}`
}

const dialogueOptions = {
  dummy: [
    "I'm just learning the ropes here.",
    "Chess? What's that?",
    "Is this thing on?",
    "I hope I don't embarrass myself."
  ],
  easy: [
    "I'm still warming up.",
    "Chess is fun! Right?",
    "Let's keep it casual, shall we?",
    "I might surprise you, or not."
  ],
  medium: [
    "I've got a few tricks up my sleeve.",
    "This game is getting interesting.",
    "I've been practicing a bit.",
    "Let's see who makes the first blunder."
  ],
  hard: [
    "I play to win, fair warning.",
    "This won't be a walk in the park.",
    "I've studied a bit of strategy.",
    "Prepare for a challenge!"
  ],
  elite: [
    "I've mastered the art of chess.",
    "You're in for a serious game.",
    "Do you even stand a chance?",
    "I see your every move in advance."
  ],
  ultimate: [
    "I am the chess grandmaster.",
    "Your fate is sealed from the start.",
    "This is more of a lesson than a game.",
    "I play on a level beyond imagination."
  ]
};

var face = document.getElementById('face')
var speech = document.getElementById('face_speechbox')
function onBraindeadSelected(){
  face.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=skinnyfat'
  speech.innerHTML = 'How does the knight move again?'
  selectedDepth = -1
}
function onEasySelected(){
  face.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=meditti'
  speech.innerHTML = 'Lets have a good match!'
  selectedDepth = 1
  console.log(selectedDepth)
}
function onMediumSelected(){
  face.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=hamza'
  speech.innerHTML = 'Challenging me? How foolish.'
  selectedDepth = 2
}
function onHardSelected(){
  face.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=pooper'
  speech.innerHTML = 'You cannot win!'
  selectedDepth = 3
}
function onDemonSelected(){
  face.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=earss'
  speech.innerHTML = 'It is time to taste my glory.'
  selectedDepth = 3
  demonMode = true
}
function onSSSelected(){
  face.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=mwowww'
  speech.innerHTML = 'Beep boop, calculating your defeat...'
  selectedDepth = 4
  demonMode = false
}

function saySomething(){
  var mode 

  if(selectedDepth == -1) mode = dialogueOptions.dummy
  else if(selectedDepth == 1) mode = dialogueOptions.easy
  else if(selectedDepth == 2) mode = dialogueOptions.medium
  else if(selectedDepth == 3 && demonMode != true) mode = dialogueOptions.hard
  else if(selectedDepth == 3) mode = dialogueOptions.elite
  else {
    mode = dialogueOptions.ultimate
  }

  var randomIdx = Math.floor(Math.random() * mode.length)

  speech.innerHTML = mode[randomIdx]
}

function reloadWindow(){
  window.location.reload() 
  document.getElementById('restart').style.visibility = 'hidden'
}

// moveAI()
// board.position(game.fen())