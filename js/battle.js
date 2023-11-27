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

const channel = ably.channels.get('chess-moves');

// Publish a move
channel.publish('move', { from: 'e2', to: 'e4' });

// Subscribe to moves
channel.subscribe('move', (message) => {
  // Handle incoming move
  console.log('Received move:', message.data);
});

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

    // var roomCode = Math.round(Math.random()*10000)
    // ws.send(JSON.stringify({ type: "createRoom", data: roomCode }))
    // document.getElementById("roomNumber").innerHTML = roomCode
}
function submitCode(){
  var roomCode = document.getElementById("roomRequest").value
  console.log(roomCode)
  // ws.send(JSON.stringify({ type: "joinRoom", data: roomCode }))
}
async function startBattle(){
  disableAllButtons()

  await generateMove()
}
async function generateMove () {
  var functions = gatherFunctions()

  await sendToWorker(battleGame.fen(), functions, selectedBattleBot.function.name, selectedBattleBot.uniqueFunctionParams ? true : false)
  moveToSend = result

  //move piece, update board, & have bot say dialogue
  battleGame.move(moveToSend)
  battleBoard.position(battleGame.fen())


  // ws.send(JSON.stringify({type: "move", data: moveToSend}))
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