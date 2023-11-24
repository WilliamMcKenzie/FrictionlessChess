var battleBoard = null
var battleGame = new Chess()
var moveToSend

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

battleBoard = Chessboard('battleBoard', 'start')