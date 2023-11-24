var battleBoard = null
var battleGame = new Chess()
var moveToSend

var joinRoomEle = document.getElementById("roomJoin")
var createdRoomEle = document.getElementById("roomCreated")
var roomMenu = document.getElementById("roomMenu")

// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:5123");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});

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

battleBoard = Chessboard('battleBoard', 'start')