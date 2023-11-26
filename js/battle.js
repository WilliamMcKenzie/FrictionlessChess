var battleBoard = null
var battleGame = new Chess()
var moveToSend

var joinRoomEle = document.getElementById("roomJoin")
var createdRoomEle = document.getElementById("roomCreated")
var roomMenu = document.getElementById("roomMenu")

const ws = new WebSocket("ws://localhost:8082")

ws.addEventListener("open", () => {
  console.log("we are connected!")

  ws.send("Hey hows it going!")
})

ws.addEventListener("message", e => {
  console.log(e)
})

async function generateMove () {
    var functions = gatherFunctions()
  
    await sendToWorker(functions, selectedBots[selectedBot].function.name, selectedBots[selectedBot].uniqueFunctionParams ? true : false)
    moveToSend = result
  
    //move piece, update board, & have bot say dialogue
    game.move(optimalMove)
    board.position(game.fen())
    saySomething()
    checkGameOver()
  
    selectedBot == 0 ? selectedBot = 1 : selectedBot = 0
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

battleBoard = Chessboard('battleBoard', 'start')