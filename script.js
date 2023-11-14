var board = null
var game = new Chess()
var fenEle = document.getElementById("fen")

const pieceVal = {'p' : 10, 'n' : 30, 'b' : 30, 'r' : 50, 'q' : 90, 'k' : 900, 'P' : -10, 'N' : -30, 'B' : -30, 'R' : -50, 'Q' : -90, 'K' : -900}
var balance = 0
var selectedDepth = 1
var demonMode = false

function eval(gameToEval, side, fen){
  var total = 0
  var layout = fen.split(" ")[0]

  for(var digit of layout){
    if(pieceVal[digit]){
      total += (pieceVal[digit]*(side == 'w' ? -1 : 1))
    }
  }
  return total
}
var moveCount = 0
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
      if(search[0] < currentSafest && !demonMode){
        return [-10000, '']
      }
      
      if(search[0] < min[0]){
        min = [search[0], search[1]]
      }
    }
    //at last iteration, evaluate min
    else {
      var curEval = eval(algo, side, fen)
      
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

  var depth = selectedDepth

  var depth = depthSearch(depth, depth, algo, eval(algo, game.turn(), game.fen()), game.turn(), '', -100000)
  var optimalMove = depth[1]
  console.log(depth)
  var randomIdx = Math.floor(Math.random() * possibleMoves.length)

  game.move(optimalMove)
  fenEle.value = game.fen()
  onMove()
  saySomething()

  // exit if the game is over
  if (game.game_over()){
    document.getElementById('face_speechbox').innerHTML = 'Too easy!'
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

  moveAI()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
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
  game = new Chess(history[history.length-1])
  board.position(game.fen())
}
function redo(){
  game = new Chess(history[history.length+1])
  board.position(game.fen())
}
function onMove(){
  var scoreEle = document.getElementById('score')
  var score = eval(game, 'white', game.fen())/10

  scoreEle.innerHTML = ` White: ${score*-1} | Black: ${score*1}`
}

const easyModePhrases = [
  "You're making this too easy for me!",
    "Are you sure you know how the pieces move?",
    "I've seen more challenging games in my sleep.",
    "Is this your first time playing chess? No shame!",
    "You're like a pawn in the grand game of life.",
    "I'm not even trying, and I'm still winning.",
    "Chess is a thinking game, but maybe not for you.",
    "Your moves are as clear as a cloudless sky.",
    "You're not even a warm-up for my brain.",
    "This is like taking candy from a baby."
];

const mediumModePhrases = [
  "I've seen better moves from a beginner!",
    "Is this your first time playing chess?",
    "Your strategy is as full of holes as Swiss cheese.",
    "I've played against tougher opponents in my sleep.",
    "You're making it too easy for me.",
    "Your moves are so predictable.",
    "I didn't know checkers players could play chess too.",
    "Are you sure you're not playing tic-tac-toe?",
    "This game is like a walk in the park for me.",
    "I'm not even breaking a sweat here."
];

const hardModePhrases = [
  "Impressive, you're actually making me think!",
    "You're putting up a good fight, but it won't be enough.",
    "Nice move! But can you keep it up?",
    "I've faced grandmasters who were easier to beat.",
    "You're in deep waters now, my friend.",
    "Your strategy is commendable, but not enough to defeat me.",
    "I admire your persistence, but it's futile.",
    "A valiant effort, but you're still a few moves behind.",
    "I can see you've been practicing. Not that it'll help much.",
    "This is chess, not checkers. Think ahead!"
];

const demonModePhrases = [
  "The flames of defeat are licking at your pieces.",
  "You're dancing with the devil on this board.",
  "Is this the best you've got? The demons yawn.",
  "You're in the inferno now. Good luck surviving.",
  "Your moves are like child's play to me.",
    "Is that the best you've got? Pathetic!",
    "I've crushed stronger opponents in my sleep.",
    "You're dancing to my demonic chess tune.",
    "Your strategy is a mere whisper in the wind.",
    "I can see your fear in every move you make.",
    "You're not even a pawn in my grand scheme.",
    "I've seen amateurs with more skill than you.",
    "You're in the presence of a chess demon. Surrender now!",
    "Every move you make is a step closer to defeat."
];

const godModePhrases = [
  "Bow before the divine moves of a chess deity.",
  "You're playing chess; I'm playing 4D chess.",
  "The gods themselves would marvel at my strategy.",
  "A mortal like you stands no chance against divinity."
];

var face = document.getElementById('face')
var speech = document.getElementById('face_speechbox')
function onEasySelected(){
  face.src = './img/difficulties/easy.png'
  speech.innerHTML = 'Lets have a good match!'
  selectedDepth = 1
}
function onMediumSelected(){
  face.src = './img/difficulties/medium.png'
  speech.innerHTML = 'Challenging me? How foolish.'
  selectedDepth = 2
}
function onHardSelected(){
  face.src = './img/difficulties/hard.png'
  speech.innerHTML = 'You cannot win!'
  selectedDepth = 3
}
function onDemonSelected(){
  face.src = './img/difficulties/demon.png'
  speech.innerHTML = 'God himself trembles in the wake of the underworld.'
  selectedDepth = 3
  demonMode = true
}
function onSSSelected(){
  face.src = './img/difficulties/god.png'
  speech.innerHTML = 'Bow before the divine moves of a chess deity!'
  selectedDepth = 4
  demonMode = true
}

function saySomething(){
  var mode 

  if(selectedDepth == 1) mode = easyModePhrases
  if(selectedDepth == 2) mode = mediumModePhrases
  if(selectedDepth == 3) mode = hardModePhrases
  if(selectedDepth == 3 && demonMode == true) mode = demonModePhrases
  if(selectedDepth == 4) mode = godModePhrases

  var randomIdx = Math.floor(Math.random() * mode.length)

  speech.innerHTML = mode[randomIdx]
}

function reloadWindow(){
  window.location.reload() 
  document.getElementById('restart').style.visibility = 'hidden'
}