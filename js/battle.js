var battleBoard = Chessboard('battleBoard', 'start')
var battleGame = new Chess()

var moveToSend
var player0 = {name: "felix0", url: "https://api.dicebear.com/7.x/bottts/svg?seed=skinnyfat"}
var player1 = {name: "felix1", url: "https://api.dicebear.com/7.x/bottts/svg?seed=pooper"}

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
let channelOpts = { params: { occupancy: 'metrics' } };

//to signal resignation and stop game
var resign = false
//if both players accept rematch
var rematch = false
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
        window.setTimeout(enableBoardMovement, 500)
      }
    }
  });
  channel.subscribe('join', (message) => {
    if(player == 0){
      document.getElementById("enemyFace").src = player1.url
      document.getElementById("enemyName").innerHTML = player1.name
      document.getElementById("startBattle").disabled = false
    }
    if(player == 1){
      document.getElementById("enemyFace").src = player0.url
      document.getElementById("enemyName").innerHTML = player0.name
    }
  });
  channel.subscribe('leave', (message) => {
    document.getElementById("enemyFace").src = `./img/blacked_out_player.svg`
    document.getElementById("enemyName").innerHTML = "Player 2"
    document.getElementById("startBattle").disabled = true
  });
  channel.subscribe('startGame', (message) => {
    document.getElementById("resignButton").disabled = false
  });
  channel.subscribe('gameOver', (message) => {
    resign = true
    if(document.getElementById("battleBoardFilter")) document.getElementById("battleBoard").removeChild(document.getElementById("battleBoardFilter"))
    if(message.data == player.toString()){
      loseBattle()
    } 
    else winBattle()
  });
  channel.subscribe('restart', (message) => {
    
    if(rematch == true && player.toString() == message.data){
      channel.publish('rematchAccepted', player.toString())
    } 

    if(player.toString() != message.data) {
      console.log(player.toString(), message.data)
      rematch = true
    } else {
      rematch = false
    }

    document.getElementById("battleRematch").innerHTML = 'Rematch (1/2)'
  });
  channel.subscribe('rematchAccepted', (message) => {
    battleGame = new Chess()
    battleBoard.position(battleGame.fen())

    document.getElementById("battleBoard").removeChild(document.getElementById("battleBoardFilter"))
    if(player == 0) startBattle()
  })
}

function disableAllButtons(){
  document.getElementById("createRoomButton").disabled = true
  document.getElementById("joinRoomButton").disabled = true
  document.getElementById("roomNumber").classList.add("disabled") 
  document.getElementById("startBattle").disabled = true
  document.getElementById("roomRequest").classList.add("disabled") 
  document.getElementById("submitCode").disabled = true
}
function enableAllButtons(){
  document.getElementById("createRoomButton").disabled = false
  document.getElementById("joinRoomButton").disabled = false
  document.getElementById("roomNumber").classList.remove("disabled") 
  document.getElementById("startBattle").disabled = false
  document.getElementById("roomRequest").classList.remove("disabled") 
  document.getElementById("submitCode").disabled = false
}
function backRoom(){
    enableAllButtons()
    battleGame = new Chess()
    battleBoard.position(battleGame.fen())
    joinRoomEle.classList.add("hidden")
    createdRoomEle.classList.add("hidden")  
    roomMenu.classList.remove("hidden") 
    if(document.getElementById("battleBoardFilter")) document.getElementById("battleBoard").removeChild(document.getElementById("battleBoardFilter"))

    channel.publish('gameOver', player.toString());
    channel.publish('leave', player.toString());
    channel.detach()
}
function joinRoom(){
    joinRoomEle.classList.remove("hidden") 
    roomMenu.classList.add("hidden") 
}
function createRoom(){
    createdRoomEle.classList.remove("hidden") 
    roomMenu.classList.add("hidden") 

    var roomCode = codewords[Math.round(Math.random()*codewords.length)] 
    
    channel = ably.channels.get(roomCode.toString());
    player = 0
    addChannelListeners()
    document.getElementById("roomNumber").innerHTML = `Code: ${roomCode}`
}
function submitCode(){
  var roomCode = document.getElementById("roomRequest").value

  var occupancy
  channel = ably.channels.get(roomCode.toString(), channelOpts);
  channel.subscribe('[meta]occupancy', (message) => {
    occupancy = message.data.metrics.connections

    if(occupancy == 1 || occupancy > 2){
      window.alert("Room not found")
      channel.detach()
    } else {
      player = 1
      addChannelListeners()
      disableAllButtons()
      enableBoardMovement() 
      channel.publish('join', player.toString());

      //go to room section
      joinRoomEle.classList.add("hidden")
      createdRoomEle.classList.remove("hidden")  
      roomMenu.classList.add("hidden") 
      document.getElementById("roomNumber").innerHTML = `Code: ${roomCode}`
      document.getElementById("exitFromCreatedRoom").disabled = false
      document.getElementById("startBattle").classList.add("disabled")
    }
  });
}
function stopBattle(){
  channel.publish('gameOver',  player.toString())
}
async function startBattle(){
  channel.publish('startGame',  player.toString())
  disableAllButtons()

  if(selectedBattleBot.function)
  {
    await generateMove()
  } else {
    enableBoardMovement()
  }
}
function winBattle(){
  document.getElementById("battleBoard").innerHTML += winBattleHTML
}
function loseBattle(){
  document.getElementById("battleBoard").innerHTML += loseBattleHTML
}
async function generateMove (){
  var functions = gatherFunctions()

  await sendToWorker(battleGame.fen(), functions, selectedBattleBot.function.name, selectedBattleBot.uniqueFunctionParams ? true : false)
  moveToSend = result

  //move piece, update board, & have bot say dialogue
  battleGame.move(moveToSend)
  battleBoard.position(battleGame.fen())

  if(battleGame.game_over()){
    channel.publish("gameOver",  player == 0 ? "1" : "0")
    return
  }

  if(!resign) channel.publish('move',  { player: player, move: moveToSend})
}
function checkBattleGameOver(){
  if (battleGame.game_over() && !document.getElementById('botContainer').classList.contains("no_access")){
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
    orientation: player == 0 ? "white" : "black",
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }
  battleBoard = Chessboard('battleBoard', config)
}
function restartBattle(){
  channel.publish('restart',  player.toString())
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