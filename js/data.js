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

var dialogueOptions = {
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

    const codewords = [
      'frog-pie',
      'king-nothing',
      'plane-ground',
      'mouse-pen',
      'blue-skies',
      'code-snake',
      'fire-ice',
      'moonlight-shadow',
      'sunflower-rain',
      'secret-garden',
      'dragonfly-breeze',
      'silent-whisper',
      'starlight-castle',
      'coffee-bean',
      'ocean-breeze',
      'mountain-mist',
      'shadow-dancer',
      'silver-lining',
      'diamond-rainbow',
      'velvet-thunder',
      'echo-mountain',
      'peacock-feather',
      'ruby-sunset',
      'stellar-symphony',
      'galaxy-tiger',
      'whispering-willow',
      'sapphire-dream',
      'ember-wind',
      'enigma-moon',
      'infinity-echo',
      'electric-horizon',
      'lunar-illusion',
      'crimson-tide',
      'polaris-firefly',
      'nebula-whirlwind',
      'jade-serenity',
      'cosmic-river',
      'zenith-thunder',
      'oracle-maze',
      'enchanting-aurora',
      'cherry-blossom',
      'obsidian-frost',
      'mystic-meadow',
      'amber-labyrinth',
      'tornado-tempest',
      'midnight-dragon',
      'solstice-song',
      'cascade-illusion',
      'labyrinth-light',
      'oracle-oasis',
      'cascade-dream',
      'whirlwind-tempest',
      'serenade-moonlight',
      'emerald-horizon',
      'solitude-dream',
      'serenity-mist',
      'quasar-echo',
      'dragonfly-harmony',
      'tempest-lullaby',
      'harmony-sunset',
      'crimson-mist',
      'gossamer-whisper',
      'firefly-labyrinth',
      'stellar-meadow',
      'butterfly-horizon',
      'whispering-tempest',
      'moonlight-symphony',
      'stellar-lullaby',
      'silhouette-horizon',
      'whirlwind-sunset',
      'ember-dragonfly',
      'sapphire-harmony',
      'quasar-illusion',
      'sunset-dream',
      'harmony-maze',
      'lunar-breeze',
      'quasar-serenity',
      'dream-whisper',
      'tiger-symphony',
      'echo-meadow',
      'whispering-horizon',
      'sunset-whirlwind',
      'moonlight-rain',
      'harmony-dream',
      'aurora-illusion',
      'tempest-serenity',
      'labyrinth-horizon',
      'firefly-whirlwind',
      'dream-lullaby',
      'echo-symphony',
      'horizon-illusion',
      'dragonfly-sunset',
      'serenity-tempest',
      'quasar-whirlwind',
      'moonlight-harmony',
      'sunset-maze',
      'labyrinth-symphony',
    ];

    var winBattleHTML = `<div id="battleBoardFilter" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; display: flex; flex-direction: column; align-items: center;">
    <div style="margin-top: auto;">
    <lord-icon
      src="https://cdn.lordicon.com/xjronrda.json"
      trigger="in"
      delay="500"
      state="in-dynamic"
      style="width:15vh;height:15vh;">
    </lord-icon>
    <lord-icon
      src="https://cdn.lordicon.com/xjronrda.json"
      trigger="in"
      delay="1000"
      state="in-dynamic"
      style="width:20vh;height:20vh;">
    </lord-icon>
    <lord-icon
      src="https://cdn.lordicon.com/xjronrda.json"
      trigger="in"
      delay="1500"
      state="in-dynamic"
      style="width:15vh;height:15vh;">
    </lord-icon>
    </div>
    <div style='font-family: "header_main"; font-size: 3rem'>Game over!</div>
    <div style="margin-bottom: 40px;
    margin-top: auto;">
      <button id="battleRematch" class="restart" onclick="restartBattle()">Rematch (0/2)</button>
      <button class="restart" onclick="backRoom()">Done</button>
    </div>
  </div>`

  var loseBattleHTML = `<div id="battleBoardFilter" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; display: flex; flex-direction: column; align-items: center;">
    <div style="margin-top: auto;">
      <div style='font-family: "header_main"; font-size: 3rem'>Game over!</div>
    </div>
    <lord-icon
        src="https://cdn.lordicon.com/wsfalxed.json"
        trigger="in"
        state="in-reveal"
        colors="primary:#4030e8,secondary:#f9c9c0"
        style="width:250px;height:250px">
      </lord-icon>
    <div style="margin-bottom: 40px;
    margin-top: auto;">
      <button id="battleRematch" class="restart" onclick="restartBattle()">Rematch (0/2)</button>
      <button class="restart" onclick="backRoom()">Done</button>
    </div>
  </div>`