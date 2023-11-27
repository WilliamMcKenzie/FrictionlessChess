var battleBoard = Chessboard('battleBoard', 'start')
var battleGame = new Chess()

var moveToSend
var opponent = {name: "felix", url: "https://api.dicebear.com/7.x/bottts/svg?seed=skinnyfat"}

var joinRoomEle = document.getElementById("roomJoin")
var createdRoomEle = document.getElementById("roomCreated")
var roomMenu = document.getElementById("roomMenu")

// const ws = new WebSocket("ws://localhost:8082");

// let clientId;

// ws.addEventListener("open", () => {
//     console.log("we are connected!");

//     ws.send(JSON.stringify({ type: 'move', data: "e3" }))
// });

// ws.addEventListener("message", e => {
//     const message = JSON.parse(e.data);
//     console.log("message")

//     if (message.type === 'client_id') {
//         clientId = message.data;
//         console.log('Received client ID:', clientId);
//     } else if(message.type == 'move') {
//         battleGame.move(message.data)
//         battleBoard.position(battleGame.fen())
//         console.log("gyeetay" + message.data)
//     } else if(message.type == 'alert'){
//         document.getElementById("startBattle").disabled = false
//     }
// });

const ably = new Ably.Realtime('6CRUdA.ipg9IQ:9Md9kAnnJWL2f65gNtkyX1EQaBH0zUEG_ZnlMROWmJ8');

//will store whichever channel user is connected too
var channel

//to signal resignation and stop game
var resign = false
//which player 
var player = 0

function addChannelListeners(){
  channel.subscribe('move', async (message) => {
    if(message.data.player != player){
      battleGame.move(message.data.move)
      battleBoard.position(battleGame.fen())

      if(selectedBattleBot.function)
      {
        window.setTimeout(generateMove, 500)
      } else {
        enableBoardMovement()
      }
    }
  });
  channel.subscribe('update', (message) => {
    document.getElementById("startBattle").disabled = false
  });
}

function disableAllButtons(){
  document.getElementById("createRoomButton").disabled = true
  document.getElementById("joinRoomButton").disabled = true
  document.getElementById("exitFromCreatedRoom").disabled = true
  document.getElementById("roomNumber").classList.add("disabled") 
  document.getElementById("startBattle").disabled = true
  document.getElementById("exitFromJoinedRoom").disabled = true
  document.getElementById("roomRequest").classList.add("disabled") 
  document.getElementById("submitCode").disabled = true
}
function backRoom(){
    joinRoomEle.classList.add("hidden")
    createdRoomEle.classList.add("hidden")  
    roomMenu.classList.remove("hidden") 
}
function joinRoom(){
    joinRoomEle.classList.remove("hidden") 
    roomMenu.classList.add("hidden") 
}
function createRoom(){
    createdRoomEle.classList.remove("hidden") 
    roomMenu.classList.add("hidden") 

    var roomCode = Math.round(Math.random()*10000)
    channel = ably.channels.get(roomCode.toString());
    player = 0
    addChannelListeners()
    document.getElementById("roomNumber").innerHTML = roomCode
}
function submitCode(){
  var roomCode = document.getElementById("roomRequest").value
  channel = ably.channels.get(roomCode.toString());
  player = 1
  addChannelListeners()
  disableAllButtons()
  channel.publish('update',  'joined');
}
function stopBattle(){
  resign = true
}
async function startBattle(){
  disableAllButtons()

  if(selectedBattleBot.function)
  {
    await generateMove()
  } else {
    enableBoardMovement()
  }
}
async function generateMove (){
  var functions = gatherFunctions()

  await sendToWorker(battleGame.fen(), functions, selectedBattleBot.function.name, selectedBattleBot.uniqueFunctionParams ? true : false)
  moveToSend = result

  //move piece, update board, & have bot say dialogue
  battleGame.move(moveToSend)
  battleBoard.position(battleGame.fen())

  if(!resign) channel.publish('move',  { player: player, move: moveToSend})
}
function enableBoardMovement(){
  //board logic
  function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (battleGame.game_over()) return false

    // only pick up pieces for the side to move
    if ((battleGame.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (battleGame.turn() === 'b' && piece.search(/^w/) !== -1) ||
        (battleGame.turn() === 'w' && player == 1) ||
        (battleGame.turn() === 'b' && player == 0)) {
      return false
    }
  }
  async function onDrop (source, target) {
    // see if the move is legal
    var move = battleGame.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
    channel.publish('move',  { player: player, move: move})
  }
  async function onSnapEnd () {
    battleBoard.position(battleGame.fen())
  }
  var config = {
    draggable: true,
    position: battleGame.fen(),
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }
  battleBoard = Chessboard('battleBoard', config)
}

function activateBattleBot(botID){
  var oldClassList = document.getElementById(`battle${selectedBattleBot.id}`).classList
  var newClassList = document.getElementById(`battle${botID}`).classList

  oldClassList.remove('selected_bot')
  newClassList.add('selected_bot')
  selectedBattleBot = addedBots[botID]
}
function activateCustomBattleBot(bot){
  var oldClassList = document.getElementById(`battle${selectedBattleBot.id}`).classList
  var newClassList = document.getElementById(`battle${bot.id}`).classList

  oldClassList.remove('selected_bot')
  newClassList.add('selected_bot')
  selectedBattleBot = bot
  console.log(bot)
}
function updateBattleBots(){
  var createBotButton = document.getElementById("createBattleBotButton")
  battleBotContainer.removeChild(document.getElementById('createBattleBotButton'))

  var bot = customBots[customBots.length-1]
  var botHTML = document.createElement('button')
  var botIcon = document.createElement('img')
    
  botIcon.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.name}`
  botHTML.appendChild(botIcon)

  botHTML.classList.add('icon_button')
  botHTML.onclick = function() {
    activateCustomBattleBot(bot)
  }
  botHTML.id = `battle${bot.id}`

  battleBotContainer.appendChild(botHTML)
  battleBotContainer.appendChild(createBotButton)
  document.getElementById(`battle${selectedBattleBot.id}`).classList.add("selected_bot")
}