var board = null
var analysisBoard = null

var game = new Chess()
var moveHistory = []
var currentMoveIndex = 0

var fenEle = document.getElementById("fen")

var face = document.getElementById('face')
var speech = document.getElementById('face_speechbox')
var robotNameEle = document.getElementById('robot_name')

var topFace = document.getElementById("topFace")
var topName = document.getElementById("topName")
var bottomFace = document.getElementById("bottomFace")
var bottomName = document.getElementById("bottomName")

var startButtonEle = document.getElementById("startButton")

var analysisBotContainer = document.getElementById('analysisBotContainer')
var createAnalysisBotButton = document.getElementById('createAnalysisBotButton')
var botContainer = document.getElementById('botContainer')
var createBotButton = document.getElementById('createBotButton')
var battleBotContainer = document.getElementById("battleBotContainer")
var createBattleBotButton = document.getElementById("createBattleBotButton")

var stopGame = false

//set up worker to execute move generation
var result
const worker = new Worker('./js/worker.js')
worker.addEventListener('message', function (e) {
  result = e.data;
});
async function sendToWorker(functions, functionToUse, uniqueFunctionParams){
  return new Promise((resolve) => {
    worker.onmessage = function (event) {
        const result = event.data;
        resolve(result);
    };

    worker.postMessage({functions: functions, fen: game.fen(), functionToUse: functionToUse, uniqueFunctionParams: uniqueFunctionParams});
  });
}

//defining the current bots that user has access to, as well as custom functions
var addedBots = [{name: 'You', faceCode: 'Shadow', id: 0},{name: 'Potlick', faceCode: 'skinnyfat', id: 1, function: makeRandomMove, lines: dialogueOptions.dummy}, {name: 'Chester', faceCode: 'meditti', id: 2, function: chesterFunction, lines: dialogueOptions.easy}, {name: 'Barley', faceCode: 'hamza', id: 3, function: barleyFunction, lines: dialogueOptions.medium}, {name: 'Sander', faceCode: 'pooper', id: 4, function: sanderFunction, lines: dialogueOptions.hard}, {name: 'Master Homo-Yo', faceCode: 'earss', id: 5, function: homoFunction, lines: dialogueOptions.ultimate}]
var customBots = []
var addedFunctions = []

//number of different scripts user has created, to track if template needs to auto populate said scripts.
var botScriptCount = 0
var evalScriptCount = 0
var shuffleScriptCount = 0

//defining which bots are currently selected in the main tab
var selectedBots = [addedBots[0],addedBots[1]]
var selectedBot = 0
var selectedAnalysisBot = addedBots[1]
var selectedBattleBot = addedBots[0]
var lockFirst = true
var lockSecond = false

var selectedDepth = -1
var side = 'b'
var optimalMove

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
//group all bot functions 
//(move generation, board evaluation, and whatever else user creates) into 1 variable
//to later send to worker file
function gatherFunctions(){
  var functions = [homoFunction, sanderFunction, barleyFunction, chesterFunction, makeRandomMove, depthSearch, depthSearchMed, getBestMove, evaluateLocal, findTile, shuffle]
  for(var customBot of customBots){
    functions.push(customBot.function.toString())
  }
  for(var addedFunction of addedFunctions){
    functions.push(addedFunction.addedFunction.toString())
  }
  for (let i = 0; i < functions.length; i++) {
    functions[i] = functions[i].toString()
  }
  return functions
}
async function moveAI () {
  var functions = gatherFunctions()

  await sendToWorker(functions, selectedBots[selectedBot].function.name, selectedBots[selectedBot].uniqueFunctionParams ? true : false)
  optimalMove = result

  //move piece, update board, & have bot say dialogue
  if(!stopGame){
    game.move(optimalMove)
    board.position(game.fen())
    saySomething()
    checkGameOver()
  }

  selectedBot == 0 ? selectedBot = 1 : selectedBot = 0
}
function checkGameOver(){
  if (game.game_over() && !document.getElementById('botContainer').classList.contains("no_access")){
    document.getElementById('face_speechbox').innerHTML = 'Good game!'
    stopGame = true
    startButtonEle.disabled = false

    document.getElementById('botContainer').classList.remove("no_opacity")
    document.getElementById('main_info_container').classList.remove("no_access")
    startButtonEle.disabled = false
    return
  } else if(game.game_over()){
    resign()
  }
}
async function moveCustomBot(){
  side = game.turn()
  console.log(side, selectedBot, selectedBots)
  await moveAI()

  if(!stopGame){
    window.setTimeout(moveCustomBot, 1000)
  } else {
    return
  }
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
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saySomething(){
  var bot = selectedBots[selectedBot]
  var randomIdx = Math.floor(Math.random() * bot.lines.length)
  speech.innerHTML = bot.lines[randomIdx]

  if(bot.faceCode) face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.faceCode}`
  else face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}`

  robotNameEle.innerHTML = bot.name
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

  topName.innerHTML = selectedBots[1].name
  bottomName.innerHTML = selectedBots[0].name
}
function activateBot(botID){
  if(addedBots[botID].name == "You"){
    face.src = `https://api.dicebear.com/7.x/personas/svg?seed=Shadow`

    robotNameEle.innerHTML = addedBots[botID].name
    speech.innerHTML = "Let's do this!"

    alterSelectedBots(addedBots[botID])
    addPlayersToBoardAddon()
    disableStart()
    return
  }

  face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${addedBots[botID].faceCode}`
  speech.innerHTML = addedBots[botID].lines[0]
  robotNameEle.innerHTML = addedBots[botID].name

  alterSelectedBots(addedBots[botID])
  addPlayersToBoardAddon()

  disableStart()
}
function activateCustomBot(bot){
  face.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}`
  speech.innerHTML = bot.lines[0]
  robotNameEle.innerHTML = bot.name
  
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
  } else {
    for (let i = 0; i < addedFunctions.length; i++) {
      if(scriptId.includes(addedFunctions[i].id)){
        addedFunctions[i].addedFunction = eval(`(${botCode})`)
        addedFunctions[i].name = addedFunctions[i].addedFunction.name
      }
    }
  }
}

var analysisConfig = {
  draggable: true,
  position: game.fen(),
  sparePieces: true,
  onSnapEnd: onAnalysisDragMove
}
function onAnalysisDragMove (newLocation, oldLocation, source,
  piece, position, orientation) {
    analysisGame = new Chess(analysisBoard.fen() + ' w KQkq - 0 1')
    document.getElementById("fen_ele").value = analysisGame.fen()
}
analysisBoard = Chessboard('analysisBoard', analysisConfig)
var analysisGame = new Chess()

function updateAnalysisBoard(){
  analysisBotContainer.removeChild(document.getElementById('createAnalysisBotButton'))

  var bot = customBots[customBots.length-1]
  var botHTML = document.createElement('button')
  var botIcon = document.createElement('img')
    
  botIcon.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}`
  botHTML.appendChild(botIcon)

  botHTML.classList.add('icon_button')
  botHTML.onclick = function() {
    activateCustomAnalysisBot(bot)  
  }
  botHTML.id = `analysis${bot.id}`

  analysisBotContainer.appendChild(botHTML)

  analysisBotContainer.appendChild(createAnalysisBotButton)
  document.getElementById(`analysis${selectedAnalysisBot.id}`).classList.add("selected_bot")
}
async function evaluateAnalysisBoard(){
  var functions = gatherFunctions()
  var optimalMove

  var temp = game.fen()
  game = new Chess(analysisGame.fen())

  await sendToWorker(functions, selectedAnalysisBot.function.name, selectedAnalysisBot.uniqueFunctionParams ? true : false)
  optimalMove = result

  analysisGame.move(optimalMove)
  analysisBoard.position(analysisGame.fen())
  side = analysisGame.turn()
  document.getElementById("fen_ele").value = analysisGame.fen()
  game = new Chess(temp)
  console.log(temp)
}

//to create and attatch the script tag
//along with user code to document.head
function createBot(){
  var botIndex = customBots.length+1

  var script = document.createElement('script');
  script.id = `script${botIndex}`
  script.innerHTML = 
`function bot${botIndex}(possibleMoves, gameState){
  //it calls this function for every move, so it returns a RANDOM move from the list of possible moves.
  var i = Math.floor(Math.random()*possibleMoves.length)
  return possibleMoves[i]
}`
  document.head.appendChild(script)

  var botID = Math.round(Math.random()*10000)
  var bot = {name: `new bot ${botIndex}`, id: botID, num: botIndex, function: window[`bot${botIndex}`], uniqueFunctionParams: true, lines: ['Beep boop, calculating your defeat...', 'System overload!', 'How does the pawn move again?']}

  var botHTML = document.createElement('button')
  botHTML.classList.add('icon_button')
  var botIcon = document.createElement('img')
  botIcon.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}`
  botHTML.appendChild(botIcon)
  botHTML.onclick = function() {activateCustomBot(bot)}
  botHTML.id = botID
  
  botContainer.removeChild(document.getElementById('createBotButton'))
  botContainer.appendChild(botHTML)
  botContainer.appendChild(createBotButton)

  customBots.push(bot)
  addNewCodeSection(bot)
  botScriptCount++
  updateAnalysisBoard()
  updateBattleBots()
}
function createEval(){
  var scriptID = Math.round((Math.random()+1)*1000)

  var script = document.createElement('script');
  script.id = `script${scriptID}`
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

  addNewEvalSection(scriptID)
  evalScriptCount++
}
function createMisc(){
  var scriptID = Math.round((Math.random()+1)*100000)

  var script = document.createElement('script');
  script.id = `script${scriptID}`
  script.innerHTML = 
`function doSomething (gameState){
  var something = "Hello World!"
  return something
}`
  document.head.appendChild(script)

  addNewMiscSection(scriptID)

  return scriptID
}

function resign(){
  if(document.getElementById('main_info_container').classList.contains("no_access")){
    stopGame = true
    startButtonEle.disabled = false

    document.getElementById('botContainer').classList.remove("no_opacity")
    document.getElementById('main_info_container').classList.remove("no_access")
    startButtonEle.disabled = false
  } else {
    board = Chessboard('board', config)
    game = new Chess()
  }
}
