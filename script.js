var board = null
var analysisBoard = null
var game = new Chess()
var fenEle = document.getElementById("fen")
var moveHistory = []
var currentMoveIndex = 0

var lockFirst = true
var lockSecond = false

var stopGame = false

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
    "I see your every move in advance.",
    "I cant let you get close!",
    "Fucking amateur."
  ],
  ultimate: [
    "I am the chess grandmaster.",
    "Your fate is sealed from the start.",
    "This is more of a lesson than a game.",
    "I play on a level beyond imagination.",
    "I cant let you get close!",
    "Fucking amateur."
  ]
};

var addedBots = [{name: 'You', faceCode: 'Shadow', id: 0},{name: 'Potlick', faceCode: 'skinnyfat', id: 1, function: makeRandomMove, lines: dialogueOptions.dummy}, {name: 'Chester', faceCode: 'meditti', id: 2, function: chesterFunction, lines: dialogueOptions.easy}, {name: 'Barley', faceCode: 'hamza', id: 3, function: barleyFunction, lines: dialogueOptions.medium}, {name: 'Sander', faceCode: 'pooper', id: 4, function: sanderFunction, lines: dialogueOptions.hard}, {name: 'Master Homo-Yo', faceCode: 'earss', id: 5, function: homoFunction, lines: dialogueOptions.ultimate}]
var customBots = []

var selectedBots = [addedBots[0],addedBots[1]]
//bot whos turn it is
var selectedBot = 0

const pieceVal = { 'p': 100, 'n': 280, 'b': 320, 'r': 479, 'q': 929, 'k': 60000, 'P' : -100, 'N' : -280, 'B' : -320, 'R' : -479, 'Q' : -929, 'K' : -60000}

var positionMap = {
  'P':[
          [ 100, 100, 100, 100, 105, 100, 100,  100],
          [  78,  83,  86,  73, 102,  82,  85,  90],
          [   7,  29,  21,  44,  40,  31,  44,   7],
          [ -17,  16,  -2,  15,  14,   0,  15, -13],
          [ -26,   3,  10,   30,  30,   1,   0, -23],
          [ -22,   9,   5, 20, 20,  -2,   3, -19],
          [ -31,   8,  -7, -37, -36, -14,   3, -31],
          [   0,   0,   0,   0,   0,   0,   0,   0]
      ],
  'N': [ 
          [-66, -53, -75, -75, -10, -55, -58, -70],
          [ -3,  -6, 100, -36,   4,  62,  -4, -14],
          [ 10,  67,   1,  74,  73,  27,  62,  -2],
          [ 24,  24,  45,  37,  33,  41,  25,  17],
          [ -1,   5,  31,  21,  22,  35,   2,   0],
          [-18,  10,  13,  22,  18,  15,  11, -14],
          [-23, -15,   2,   0,   2,   0, -23, -20],
          [-74, -23, -26, -24, -19, -35, -22, -69]
      ],
  'B': [ 
          [-59, -78, -82, -76, -23,-107, -37, -50],
          [-11,  20,  35, -42, -39,  31,   2, -22],
          [ -9,  39, -32,  41,  52, -10,  28, -14],
          [ 25,  17,  20,  34,  26,  25,  15,  10],
          [ 13,  10,  17,  23,  17,  16,   0,   7],
          [ 14,  25,  24,  15,   8,  25,  20,  15],
          [ 19,  20,  11,   6,   7,   6,  20,  16],
          [ -7,   2, -15, -12, -14, -15, -10, -10]
      ],
  'R': [  
          [ 35,  29,  33,   4,  37,  33,  56,  50],
          [ 55,  29,  56,  67,  55,  62,  34,  60],
          [ 19,  35,  28,  33,  45,  27,  25,  15],
          [  0,   5,  16,  13,  18,  -4,  -9,  -6],
          [-28, -35, -16, -21, -13, -29, -46, -30],
          [-42, -28, -42, -25, -25, -35, -26, -46],
          [-53, -38, -31, -26, -29, -43, -44, -53],
          [-30, -24, -18,   5,  -2, -18, -31, -32]
      ],
  'Q': [   
          [  6,   1,  -8,-104,  69,  24,  88,  26],
          [ 14,  32,  60, -10,  20,  76,  57,  24],
          [ -2,  43,  32,  60,  72,  63,  43,   2],
          [  1, -16,  22,  17,  25,  20, -13,  -6],
          [-14, -15,  -2,  -5,  -1, -10, -20, -22],
          [-30,  -6, -13, -11, -16, -11, -16, -27],
          [-36, -18,   0, -19, -15, -15, -21, -38],
          [-39, -30, -31, -13, -31, -36, -34, -42]
      ],
  'K': [  
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
positionMap['p'] = positionMap['P'].slice().reverse()
positionMap['n'] = positionMap['N'].slice().reverse()
positionMap['b'] = positionMap['B'].slice().reverse()
positionMap['r'] = positionMap['R'].slice().reverse()
positionMap['q'] = positionMap['Q'].slice().reverse()
positionMap['k'] = positionMap['K'].slice().reverse()

var balance = 0
var selectedDepth = -1
var demonMode = false
var side = 'b'

function evaluateLocal(gameToEval, side, fen){
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
      var rating = evaluateLocal(algo, side, currentGame)
      if(yourTurn && rating < b){
        b = rating
      }
      else if(!yourTurn && rating > a){
        a = rating
      }
    }

    algo.undo()
  }

  return yourTurn ? b : a
}

function getBestMove(){
  var moves = game.moves()
  var algo = new Chess(game.fen())
  var safestMove = ['', -Infinity]

  for(var i = 0; i < moves.length; i++){
    algo.move(moves[i])

    var search = depthSearchMed(1, 1, algo, -Infinity, Infinity)
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

    algo.move(moves[i])
    var fen = algo.fen()

    //if it is the first iteration, set root move
    if(depth+1 == originalDepth){
      //for if depth is only 1, just attack whenever possible
      if(originalDepth == 1){
        var curEval = evaluateLocal(algo, side, fen)
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
      var curEval = evaluateLocal(algo, side, fen)
      
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

function makeRandomMove(){
  var i = Math.round(Math.random()*game.moves().length)
  console.log(game.moves())
  return game.moves()[i]
}

function chesterFunction(){
  var algo = new Chess(game.fen())

  var depth = depthSearch(1, 1, algo, evaluateLocal(algo, game.turn(), game.fen()), game.turn(), '', 1000, -1000)
  return depth[1]
}

function barleyFunction(){
  return getBestMove()[0]
}

function sanderFunction(){
  var algo = new Chess(game.fen())

  var depth = depthSearch(3, 3, algo, evaluateLocal(algo, game.turn(), game.fen()), game.turn(), '', 1000, -1000)
  return depth[1]
}

function homoFunction(){
  var algo = new Chess(game.fen())
  demonMode = true

  var depth = depthSearch(3, 3, algo, evaluateLocal(algo, game.turn(), game.fen()), game.turn(), '', 1000, -1000)

  demonMode = false
  return depth[1]
}

function moveAI () {
  var optimalMove
  var bot = selectedBots[selectedBot]

  if(bot.uniqueFunctionParams){
    optimalMove = bot.function(game.moves(), game)
  } else {
    optimalMove = bot.function()
  }

  game.move(optimalMove)
  saySomething()
  board.position(game.fen())

  // exit if the game is over
  if (game.game_over() && !document.getElementById('botContainer').classList.contains("no_access")){
    document.getElementById('face_speechbox').innerHTML = 'Good game!'
    document.getElementById('restart').disabled = false
    return
  } else if(game.game_over()){
    resign()
  }

  selectedBot == 0 ? selectedBot = 1 : selectedBot = 0
}


//board logic
function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

async function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'
  moveHistory.push(game.fen())
  selectedBot == 0 ? selectedBot = 1 : selectedBot = 0

  side = "b"
  await sleep(500)
  window.setTimeout(moveAI(), 0);
  board.position(game.fen())
}

async function onSnapEnd () {
  board.position(game.fen())
  document.getElementById('restart').disabled = true
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('board', config)


//utilities
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
function reset(){
  game = new Chess()
  board.position(game.fen())
}


var face = document.getElementById('face')
var speech = document.getElementById('face_speechbox')
var robotNameEle = document.getElementById('robot_name')

function saySomething(){
  var bot = selectedBots[selectedBot]
  var randomIdx = Math.floor(Math.random() * bot.lines.length)
  speech.innerHTML = bot.lines[randomIdx]

  if(bot.faceCode) face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.faceCode}`
  else face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}`

  robotNameEle.innerHTML = bot.name.toUpperCase()
}

function restartGame(){
  game = new Chess()
  board.position(game.fen())
  document.getElementById('restart').disabled = true


  if(selectedBots[0].name != "You"){
     battleBots()
  } else {
    selectedBot = 0
    console.log(selectedBots[selectedBot].function)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




function lockChange(which){
  if(which == 1) {
    lockFirst == true ? lockFirst = false : lockFirst = true

    if(lockFirst){
      document.getElementById(selectedBots[0].id.toString()).classList.add('locked_bot')
    } else {
      document.getElementById(selectedBots[0].id.toString()).classList.remove('locked_bot')
    }
  } else {
    lockSecond == true ? lockSecond = false : lockSecond = true

    if(lockSecond){
      document.getElementById(selectedBots[1].id.toString()).classList.add('locked_bot')
    } else {
      document.getElementById(selectedBots[1].id.toString()).classList.remove('locked_bot')
    }
  }
}

function alterSelectedBots(newBot){
  var oldClassList = document.getElementById(selectedBots[0].id).classList
  var newClassList = document.getElementById(newBot.id.toString()).classList

  if(lockFirst && lockSecond){
    return
  }
  if(lockFirst){
    document.getElementById(selectedBots[1].id).classList.remove('selected_bot')
    newClassList.add('selected_bot')
    selectedBots.pop()
    selectedBots.push(newBot)

    return
  }
  if(lockSecond){
    oldClassList.remove('selected_bot')
    newClassList.add('selected_bot')
    selectedBots.shift()
    selectedBots.unshift(newBot)

    return
  }
  if(!lockFirst && !lockSecond){
    oldClassList.remove('selected_bot')
    newClassList.add('selected_bot')
    selectedBots.shift()
    selectedBots.push(newBot)
  }
}

function addPlayersToBoardAddon(){
  var topFace = document.getElementById("topFace")
  var topName = document.getElementById("topName")
  var bottomFace = document.getElementById("bottomFace")
  var bottomName = document.getElementById("bottomName")

  if(selectedBots[1].faceCode){
    if(selectedBots[1].name == "You") topFace.src = `https://api.dicebear.com/7.x/personas/svg?seed=Shadow`
    else topFace.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedBots[1].faceCode}`
  }else{
    topFace.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedBots[1].name}`
  }

  if(selectedBots[0].faceCode){
    if(selectedBots[0].name == "You") bottomFace.src = `https://api.dicebear.com/7.x/personas/svg?seed=Shadow`
    else bottomFace.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedBots[0].faceCode}`
  }else{
    bottomFace.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedBots[0].name}`
  }

  topName.innerHTML = selectedBots[1].name.toUpperCase()
  bottomName.innerHTML = selectedBots[0].name.toUpperCase()
}

function disableStart(){
  if(selectedBots[0].name !== "You" && selectedBots[1].name !== "You") startButtonEle.disabled = false
  else startButtonEle.disabled = true
}

var startButtonEle = document.getElementById("startButton")
function activateBot(botID){
  if(addedBots[botID].name == "You"){
    face.src = `https://api.dicebear.com/7.x/personas/svg?seed=Shadow`

    robotNameEle.innerHTML = addedBots[botID].name.toUpperCase()
    speech.innerHTML = "Let's do this!"

    alterSelectedBots(addedBots[botID])
    addPlayersToBoardAddon()
    disableStart()
    return
  }

  face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${addedBots[botID].faceCode}`
  speech.innerHTML = addedBots[botID].lines[0]
  robotNameEle.innerHTML = addedBots[botID].name.toUpperCase()

  alterSelectedBots(addedBots[botID])
  addPlayersToBoardAddon()

  disableStart()
}
function activateCustomBot(bot){
  face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}`
  speech.innerHTML = bot.lines[0]
  robotNameEle.innerHTML = bot.name.toUpperCase()
  
  alterSelectedBots(bot)
  addPlayersToBoardAddon()

  disableStart()
}

function saveBot(scriptId, botNUM) {
  document.getElementById(`saveButton${botNUM}`).disabled = true
  var botCode = document.getElementById(`codeInput${botNUM}`).value;
  var script = document.createElement('script');
  script.id = scriptId
  script.innerHTML = botCode
    
  document.head.removeChild(document.getElementById(scriptId))
  document.head.appendChild(script)
    
  if(botNUM < 100){
    var functionReference = window[`bot${botNUM}`]
    customBots[botNUM-1].function = functionReference
  }
}

var botScriptCount = 0
var evalScriptCount = 0
var shuffleScriptCount = 0

function createBot(){
  var botNUM = customBots.length+1
  var botContainer = document.getElementById('botContainer')
  var createBotButton = document.getElementById('createBotButton')

  var script = document.createElement('script');
  script.id = `script${botNUM}`
  script.innerHTML = 
`function bot${botNUM}(possibleMoves, gameState){
  //it calls this function for every move, so it returns a RANDOM move from the list of possible moves.
  var i = Math.floor(Math.random()*possibleMoves.length)
  return possibleMoves[i]
}`
  document.head.appendChild(script)

  var botID = Math.round(Math.random()*10000)
  var functionReference = eval(`bot${botNUM}`)
  var bot = {name: `new bot ${botNUM}`, id: botID, num: botNUM, function: window[`bot${botNUM}`], uniqueFunctionParams: true, lines: ['Beep boop, calculating your defeat...', 'System overload!', 'How does the pawn move again?']}

  var botHTML = document.createElement('button')
  botHTML.classList.add('icon_button')
  botHTML.style.backgroundImage = `url("https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}")`
  botHTML.onclick = function() {activateCustomBot(bot)}
  botHTML.id = botID
  
  botContainer.removeChild(document.getElementById('createBotButton'))
  botContainer.appendChild(botHTML)
  botContainer.appendChild(createBotButton)

  customBots.push(bot)
  addNewCodeSection(bot)
  botScriptCount++
}
function createEval(){
  var evalNUM = Math.round((Math.random()+1)*1000)

  var script = document.createElement('script');
  script.id = `script${evalNUM}`
  script.innerHTML = 
`function evaluate (gameState){
  var totalScore = 0
  var layout = gameState.fen().split(" ")[0]
  
  const pieceVal = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100, 'P' : -1, 'N' : -3, 'B' : -3, 'R' : -5, 'Q' : -9, 'K' : -100}

  for(var piece of layout){
    if(pieceVal[piece]){
      totalScore += (pieceVal[piece]*(side == 'w' ? -1 : 1))
    }
  }
  return totalScore
}`
  document.head.appendChild(script)

  addNewEvalSection(evalNUM)
  evalScriptCount++
}
function createMisc(){
  var evalNUM = Math.round((Math.random()+1)*100000)

  var script = document.createElement('script');
  script.id = `script${evalNUM}`
  script.innerHTML = 
`function doSomething (gameState){
  var something = "Hello World!"
  return something
}`
  document.head.appendChild(script)

  addNewMiscSection(evalNUM)

  return evalNUM
}

function useBot(){
  window.setTimeout(moveCustomBot(), 500)
}

function addNewCodeSection(bot){
  var HTMLToAdd = document.createElement('div')
  HTMLToAdd.id = `codeSection${bot.id}`
  HTMLToAdd.innerHTML = `<div class="custom_bot_code_container" id="container${bot.num}">
  <input id='botNameElement${bot.num}' class="codeInputHeader" spellcheck="false" value="${bot.name}" onchange="updateBotName(${bot.num})">
  <button class="collapse_button" onclick="collapseCode(${bot.num})">
          <i class="fa-solid fa-chevron-down"></i>
  </button>
  <textarea onchange="document.getElementById('saveButton${bot.num}').disabled = false" id="codeInput${bot.num}" class="code_input" spellcheck="false" cols="50" onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>
${bot.function}
  </textarea>
  <div class="code_options">
      <button class="save_button" id="saveButton${bot.num}" disabled onclick="saveBot('script${bot.num}', ${bot.num})">
          <i style="margin-right: 5px;" class="fa-solid fa-save"></i> SAVE
      </button>
      <button class="template_button" onclick="openPopup(${bot.num})">
          <i style="margin-right: 5px;" class="fa-solid fa-file"></i> TEMPLATE
      </button>
      <button class="trash_button" onclick="trashBot(${bot.id}, ${bot.num})">
          <i style="margin-right: 5px;" class="fa-solid fa-trash"></i> TRASH
      </button>
  </div>
  </div>`
  document.getElementById('codeContainer').appendChild(HTMLToAdd)

  document.getElementById(`codeInput${bot.num}`).style.height = ""
  document.getElementById(`codeInput${bot.num}`).style.height = document.getElementById(`codeInput${bot.num}`).scrollHeight + "px"
}
function addNewEvalSection(id){
  var HTMLToAdd = document.createElement('div')
  HTMLToAdd.id = `codeSection${id}`
  HTMLToAdd.innerHTML = `<div class="custom_bot_code_container" id="container${id}">
  <input class="codeInputHeader" spellcheck="false" value="evaluation function">
  <button class="collapse_button" onclick="collapseCode(${id})">
          <i class="fa-solid fa-chevron-down"></i>
  </button>
  <textarea onchange="document.getElementById('saveButton${id}').disabled = false" id="codeInput${id}" class="code_input" spellcheck="false" cols="50" onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>
function evaluate (gameState){
  var totalScore = 0
  var layout = gameState.fen().split(" ")[0]
  const pieceVal = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100, 'P' : -1, 'N' : -3, 'B' : -3, 'R' : -5, 'Q' : -9, 'K' : -100}
  
  for(var piece of layout){
    if(pieceVal[piece]){
      totalScore += (pieceVal[piece]*(side == 'w' ? -1 : 1))
    }
  }
  return totalScore
}</textarea>
  <div class="code_options">
      <button class="save_button" id="saveButton${id}" disabled onclick="saveBot('script${id}', ${id})">
          <i style="margin-right: 5px;" class="fa-solid fa-save"></i> SAVE
      </button>
      <button class="template_button" onclick="openPopup(${id})">
          <i style="margin-right: 5px;" class="fa-solid fa-file"></i> TEMPLATE
      </button>
      <button class="trash_button" onclick="trashCode(${id})">
          <i style="margin-right: 5px;" class="fa-solid fa-trash"></i> TRASH
      </button>
  </div>
  </div>`

  document.getElementById('codeContainer').appendChild(HTMLToAdd)
  document.getElementById(`codeInput${id}`).style.height = ""
  document.getElementById(`codeInput${id}`).style.height = (document.getElementById(`codeInput${id}`).scrollHeight + 20) + "px"
}
function addNewMiscSection(id){
  var HTMLToAdd = document.createElement('div')
  HTMLToAdd.id = `codeSection${id}`
  HTMLToAdd.innerHTML = `<div class="custom_bot_code_container" id="container${id}">
  <input class="codeInputHeader" spellcheck="false" value="misc function">
  <button class="collapse_button" onclick="collapseCode(${id})">
          <i class="fa-solid fa-chevron-down"></i>
  </button>
  <textarea onchange="document.getElementById('saveButton${id}').disabled = false" id="codeInput${id}" class="code_input" spellcheck="false" cols="50" onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>
function doSomething (gameState){
  var something = "Hello World!"
  return something
}
  </textarea>
  <div class="code_options">
      <button class="save_button" id="saveButton${id}" disabled onclick="saveBot('script${id}', ${id})">
          <i style="margin-right: 5px;" class="fa-solid fa-save"></i> SAVE
      </button>
      <button class="template_button" onclick="openPopup(${id})">
          <i style="margin-right: 5px;" class="fa-solid fa-file"></i> TEMPLATE
      </button>
      <button class="trash_button" onclick="trashCode(${id})">
          <i style="margin-right: 5px;" class="fa-solid fa-trash"></i> TRASH
      </button>
  </div>
  </div>`

  document.getElementById('codeContainer').appendChild(HTMLToAdd)
  document.getElementById(`codeInput${id}`).style.height = ""
  document.getElementById(`codeInput${id}`).style.height = document.getElementById(`codeInput${id}`).scrollHeight + "px"
}

function trashBot(id, index){
  var botNUM = index
  var botContainer = document.getElementById('botContainer')
  var createBotButton = document.getElementById('createBotButton')

  var script = document.getElementById(`script${botNUM}`);
  document.head.removeChild(script)
  botContainer.removeChild(document.getElementById(id))

  for(var i = 0; i < customBots.length; i++){
    if(customBots[i].id == id) customBots.splice(i, 1)
  }
  document.getElementById('codeContainer').removeChild(document.getElementById(`codeSection${id}`))
  botScriptCount--
}
function trashCode(index){
  var script = document.getElementById(`script${index}`);
  document.head.removeChild(script)

  var codeValue = document.getElementById(`codeInput${index}`).value
  if(index > 10000 && codeValue.includes("shuffle(array)")) shuffleScriptCount--

  document.getElementById('codeContainer').removeChild(document.getElementById(`codeSection${index}`))

  if(index < 10000) evalScriptCount--
}

function collapseCode(botNUM){
  if(document.getElementById(`container${botNUM}`).classList.contains("custom_bot_code_container_collapsed")){
    document.getElementById(`container${botNUM}`).classList.remove("custom_bot_code_container_collapsed")
  }
  else {
    document.getElementById(`container${botNUM}`).classList.add("custom_bot_code_container_collapsed")
  }
}

function updateBotName(botNUM){
  customBots[botNUM-1].name = document.getElementById(`botNameElement${botNUM}`).value
  var bot = customBots[botNUM-1]

  document.getElementById(bot.id).style.backgroundImage = `url("https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}")`
}

function moveCustomBot(){
  side = game.turn()

  window.setTimeout(moveAI());

  if(!stopGame){
    window.setTimeout(moveCustomBot, 1000)
  } else {
    document.getElementById('botContainer').classList.remove("no_access")
    startButtonEle.disabled = false
    stopGame = false 
    return
  }
}

function battleBots(){
  startButtonEle.disabled = true
  document.getElementById('botContainer').classList.add("no_access")
  side = "w"
  moveAI()
  window.setTimeout(moveCustomBot, 1000)
}

function resign(){
  if(document.getElementById('botContainer').classList.contains("no_access")){
    stopGame = true
    startButtonEle.disabled = false
    document.getElementById('face_speechbox').innerHTML = 'Good game!'
    document.getElementById('restart').disabled = false
  } else {
    board = Chessboard('board', config)
    game = new Chess()
  }
}


var currentPopupIndex

var botTemplates = [

`function {BOTNAME}(possibleMoves, gameState){
  //it calls this function for every move, so it returns a RANDOM move from the list of possible moves.
  var i = Math.floor(Math.random()*possibleMoves.length)
  return possibleMoves[i]
}`,

`function {BOTNAME}(possibleMoves, gameState){
  //it calls this function for every move, so it returns a RANDOM move from the list of possible moves.
  var bestMove = ""
  var bestMoveEvaluation = -100000
  var dummyGame = new Chess(gameState.fen())
  var side = gameState.turn()
   
  for(var i = 0; i < possibleMoves.length; i++){
    dummyGame.move(possibleMoves[i])
    var evaluation = evaluate(dummyGame )
  
    if(evaluation > bestMoveEvaluation) {
      bestMove = possibleMoves[i]
      bestMoveEvaluation = evaluation 
    }
    dummyGame.undo()
  }
  
  return bestMove
}`,

`function {BOTNAME}(possibleMoves, gameState){
  //it calls this function for every move, so it returns a RANDOM move from the list of possible moves.
  possibleMoves = shuffle(possibleMoves)
  var bestMove = ""
  var bestMoveEvaluation = -100000
  var dummyGame = new Chess(gameState.fen())
  var side = gameState.turn()
   
  for(var i = 0; i < possibleMoves.length; i++){
    dummyGame.move(possibleMoves[i])
    
    var enemyPossibleMoves = dummyGame.moves()
    enemyPossibleMoves = shuffle(enemyPossibleMoves)

    var worstMoveEvaluation = 100000

    for(var move of enemyPossibleMoves){
      dummyGame.move(move)
      var evaluation = evaluate(dummyGame)
  
      if(evaluation < worstMoveEvaluation) {
        worstMoveEvaluation = evaluation 
      }
      dummyGame.undo()
    }

    if(worstMoveEvaluation > bestMoveEvaluation){
      bestMove = possibleMoves[i]
      bestMoveEvaluation = worstMoveEvaluation
    }

    dummyGame.undo()
  }
  
  return bestMove
}`,

`function {BOTNAME}(possibleMoves, gameState){
  //it calls this function for every move, so it returns a RANDOM move from the list of possible moves.
  var bestMove = ""
  var bestMoveEvaluation = -1000
  var dummyGame = new Chess(gameState.fen())
   
  for(var i = 0; i < possibleMoves.length; i++){
    dummyGame.move(possibleMoves[i])
    var worstMoveEvaluation = 1000

    for(var k = 0; i < dummyGame.moves().length; k++){
      var evaluation = evaluate(dummyGame )
  
      if(evaluation < worstMoveEvaluation) {
        worstMoveEvaluation = evaluation 
      }
      dummyGame.undo()
    }

    if(worstMoveEvaluation > bestMoveEvaluation){
      bestMove = possibleMoves[i]
      bestMoveEvaluation = worstMoveEvaluation
    }

    dummyGame.undo()
  }
  
  return bestMove
}`]
var evalTemplates = [

  `function evaluate (gameState){
  var totalScore = 0
  var layout = gameState.fen().split(" ")[0]
  const pieceVal = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100, 'P' : -1, 'N' : -3, 'B' : -3, 'R' : -5, 'Q' : -9, 'K' : -100}
  
  for(var piece of layout){
    if(pieceVal[piece]){
      totalScore += (pieceVal[piece]*(side == 'w' ? -1 : 1))
    }
  }
  return totalScore
}`,
  
`function evaluate(gameState){
  var totalScore = 0
  var layout = gameState.fen().split(" ")[0]

  const pieceVal = { 'p': 100, 'n': 280, 'b': 320, 'r': 479, 'q': 929, 'k': 60000, 'P' : -100, 'N' : -280, 'B' : -320, 'R' : -479, 'Q' : -929, 'K' : -60000}
  var positionMap = {
    'P':[
            [ 100, 100, 100, 100, 105, 100, 100,  100],
            [  78,  83,  86,  73, 102,  82,  85,  90],
            [   7,  29,  21,  44,  40,  31,  44,   7],
            [ -17,  16,  -2,  15,  14,   0,  15, -13],
            [ -26,   3,  10,   30,  30,   1,   0, -23],
            [ -22,   9,   5, 20, 20,  -2,   3, -19],
            [ -31,   8,  -7, -37, -36, -14,   3, -31],
            [   0,   0,   0,   0,   0,   0,   0,   0]
        ],
    'N': [ 
            [-66, -53, -75, -75, -10, -55, -58, -70],
            [ -3,  -6, 100, -36,   4,  62,  -4, -14],
            [ 10,  67,   1,  74,  73,  27,  62,  -2],
            [ 24,  24,  45,  37,  33,  41,  25,  17],
            [ -1,   5,  31,  21,  22,  35,   2,   0],
            [-18,  10,  13,  22,  18,  15,  11, -14],
            [-23, -15,   2,   0,   2,   0, -23, -20],
            [-74, -23, -26, -24, -19, -35, -22, -69]
        ],
    'B': [ 
            [-59, -78, -82, -76, -23,-107, -37, -50],
            [-11,  20,  35, -42, -39,  31,   2, -22],
            [ -9,  39, -32,  41,  52, -10,  28, -14],
            [ 25,  17,  20,  34,  26,  25,  15,  10],
            [ 13,  10,  17,  23,  17,  16,   0,   7],
            [ 14,  25,  24,  15,   8,  25,  20,  15],
            [ 19,  20,  11,   6,   7,   6,  20,  16],
            [ -7,   2, -15, -12, -14, -15, -10, -10]
        ],
    'R': [  
            [ 35,  29,  33,   4,  37,  33,  56,  50],
            [ 55,  29,  56,  67,  55,  62,  34,  60],
            [ 19,  35,  28,  33,  45,  27,  25,  15],
            [  0,   5,  16,  13,  18,  -4,  -9,  -6],
            [-28, -35, -16, -21, -13, -29, -46, -30],
            [-42, -28, -42, -25, -25, -35, -26, -46],
            [-53, -38, -31, -26, -29, -43, -44, -53],
            [-30, -24, -18,   5,  -2, -18, -31, -32]
        ],
    'Q': [   
            [  6,   1,  -8,-104,  69,  24,  88,  26],
            [ 14,  32,  60, -10,  20,  76,  57,  24],
            [ -2,  43,  32,  60,  72,  63,  43,   2],
            [  1, -16,  22,  17,  25,  20, -13,  -6],
            [-14, -15,  -2,  -5,  -1, -10, -20, -22],
            [-30,  -6, -13, -11, -16, -11, -16, -27],
            [-36, -18,   0, -19, -15, -15, -21, -38],
            [-39, -30, -31, -13, -31, -36, -34, -42]
        ],
    'K': [  
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
  positionMap['p'] = positionMap['P'].slice().reverse()
  positionMap['n'] = positionMap['N'].slice().reverse()
  positionMap['b'] = positionMap['B'].slice().reverse()
  positionMap['r'] = positionMap['R'].slice().reverse()
  positionMap['q'] = positionMap['Q'].slice().reverse()
  positionMap['k'] = positionMap['K'].slice().reverse()

  var posX = 0
  var posY = 0

  var positionValue = 0

  for(var piece of layout){
    if(pieceVal[piece]){
      positionValue += positionMap[piece][posX][posY]*(piece.toUpperCase() == piece ? -1 : 1)
      totalScore += (pieceVal[piece]*(side == 'w' ? -1 : 1))
      posX++
    }
    else if(piece != '/'){
      posX++
    }else {
      posY++
      posX = 0
    }
  }
  return totalScore+positionValue
}`]
var miscTemplates = [

`function shuffle(array) {
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
}`,
  
`function findTile(move){
  var res = ''
  for(var digit of move){
    if(digit.toUpperCase() != digit && digit != 'x'){
      res += digit
    }
  }
  return res
}`]

var botTemplateButtons = `<button class="template_button" onclick="setTemplate('bot', 0)">
<i class="fa-solid fa-chess-pawn" style="margin-right: 5px;"></i> RANDOM
</button>
<button class="template_button" onclick="setTemplate('bot', 1)">
<i class="fa-solid fa-chess-knight" style="margin-right: 5px;"></i> DEPTH 1
</button>
<button class="template_button" onclick="setTemplate('bot', 2)">
<i class="fa-solid fa-chess-rook" style="margin-right: 5px;"></i> DEPTH 2
</button>
<button class="template_button" onclick="setTemplate('bot', 3)">
<i class="fa-solid fa-chess-queen" style="margin-right: 5px;"></i> DEPTH 3
</button>`
var evalTemplateButtons = `<button class="template_button" onclick="setTemplate('eval', 0)">
<i class="fa-solid fa-chess-pawn" style="margin-right: 5px;"></i> STANDARD
</button>
<button class="template_button" onclick="setTemplate('eval', 1)">
<i class="fa-solid fa-chess-board" style="margin-right: 5px;"></i> POSITION
</button>`
var miscTemplateButtons = `<button class="template_button" onclick="setTemplate('misc', 0)">
<i class="fa-solid fa-shuffle" style="margin-right: 5px;"></i> SHUFFLE
</button>
<button class="template_button" onclick="setTemplate('misc', 1)">
<i class="fa-solid fa-magnifying-glass" style="margin-right: 5px;"></i> FIND TILE
</button>`

function openPopup(i){
  currentPopupIndex = i
  document.getElementById("templatesPopupContainer").classList.remove("hidden")
  document.getElementById("mask").classList.remove("hidden")

  if(i < 1000){
    document.getElementById('popupBody').innerHTML = botTemplateButtons
  }
  else if(i < 100000){
    document.getElementById('popupBody').innerHTML = evalTemplateButtons
  } else {
    document.getElementById('popupBody').innerHTML = miscTemplateButtons
  }
}
function closePopup(){
  document.getElementById("templatesPopupContainer").classList.add("hidden")
  document.getElementById("mask").classList.add("hidden")
}
function setTemplate(type, index){
  if(type == 'bot'){
    var HTMLToAdd = botTemplates[index]
    HTMLToAdd = HTMLToAdd.replace("{BOTNAME}", `bot${currentPopupIndex}`)
    document.getElementById(`codeInput${currentPopupIndex}`).value = HTMLToAdd

    document.getElementById(`codeInput${currentPopupIndex}`).style.height = ""
    document.getElementById(`codeInput${currentPopupIndex}`).style.height = document.getElementById(`codeInput${currentPopupIndex}`).scrollHeight + "px"

    if(index > 0 && evalScriptCount < 1){
      createEval()
    }

    if(index > 1 && shuffleScriptCount < 1){
      currentPopupIndex = createMisc()

      setTemplate("misc", 0)
    }
  }
  if(type == 'eval'){
    var HTMLToAdd = evalTemplates[index]
    document.getElementById(`codeInput${currentPopupIndex}`).value = HTMLToAdd
  }

  if(type == 'misc'){
    var HTMLToAdd = miscTemplates[index]
    document.getElementById(`codeInput${currentPopupIndex}`).value = HTMLToAdd

    if(index == 0) shuffleScriptCount++
  }

  saveBot(`script${currentPopupIndex}`, currentPopupIndex)
  document.getElementById(`codeInput${currentPopupIndex}`).style.height = ""
  document.getElementById(`codeInput${currentPopupIndex}`).style.height = document.getElementById(`codeInput${currentPopupIndex}`).scrollHeight + "px"
  closePopup()
}

function switchTabs(newTabID){
  document.getElementById("main").classList.add("hidden")
  document.getElementById("codeContainer").classList.add("hidden")
  document.getElementById("position").classList.add("hidden")

  document.getElementById(newTabID).classList.remove("hidden")
}

var analysisConfig = {
  draggable: true,
  position: 'start',
  onDragMove: onAnalysisDragMove,
  sparePieces: true
}
function onAnalysisDragMove (newLocation, oldLocation, source,
  piece, position, orientation) {
console.log('New location: ' + newLocation)
console.log('Old location: ' + oldLocation)
console.log('Source: ' + source)
console.log('Piece: ' + piece)
console.log('Position: ' + Chessboard.objToFen(position))
console.log('Orientation: ' + orientation)
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
}
analysisBoard = Chessboard('analysisBoard', analysisConfig)
// moveAI()
// board.position(game.fen())
