var currentPopupIndex
function disableStart(){
    if(selectedBots[0].name !== "You" && selectedBots[1].name !== "You") startButtonEle.disabled = false
    else startButtonEle.disabled = true
  }

function activateAnalyisisBot(botID){
    var oldClassList = document.getElementById(`analysis${selectedAnalysisBot.id}`).classList
    var newClassList = document.getElementById(`analysis${botID}`).classList
  
    oldClassList.remove('selected_bot')
    newClassList.add('selected_bot')
    selectedAnalysisBot = addedBots[botID]
  }
  function activateCustomAnalysisBot(bot){
    var oldClassList = document.getElementById(`analysis${selectedAnalysisBot.id}`).classList
    var newClassList = document.getElementById(`analysis${bot.id}`).classList
  
    oldClassList.remove('selected_bot')
    newClassList.add('selected_bot')
    selectedAnalysisBot = bot
  }

function resetAnalysisBoard(){
    analysisBoard = Chessboard('analysisBoard', analysisConfig)
    side = analysisGame.turn()
  }
  function updateFen(){
    analysisGame = new Chess(document.getElementById("fen_ele").value)
    analysisBoard.position(analysisGame.fen())
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
    }
    addedFunctions.push({name: "evaluate", id: id, addedFunction: evaluate})
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
  
    function doSomething (gameState){
      var something = "Hello World!"
      return something
    }
    addedFunctions.push({name: "doSomething", id: id, addedFunction: doSomething})
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
  
    for (let i = 0; i < addedFunctions.length; i++) {
      if(index == addedFunctions[i].id){
        addedFunctions.splice(i, 1)
      }
    }
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

    for (let i = 0; i < addedFunctions.length; i++) {
      if(currentPopupIndex == addedFunctions[i].id){
        addedFunctions[i].addedFunction = eval(`(${evalTemplates[index]})`)
        addedFunctions[i].name = addedFunctions[i].addedFunction.name
      }
    }
  }

  if(type == 'misc'){
    var HTMLToAdd = miscTemplates[index]
    document.getElementById(`codeInput${currentPopupIndex}`).value = HTMLToAdd

    for (let i = 0; i < addedFunctions.length; i++) {
      if(currentPopupIndex == addedFunctions[i].id){
        addedFunctions[i].addedFunction = eval(`(${miscTemplates[index]})`)
        addedFunctions[i].name = addedFunctions[i].addedFunction.name
      }
    }

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
  document.getElementById("battle").classList.add("hidden")

  if(newTabID == "main") side = game.turn()
  else side = analysisGame.turn()

  document.getElementById(newTabID).classList.remove("hidden")
}
function switchMode(mode){
  if(mode == "light"){
    document.getElementById(mode).classList.add("hidden")
    document.getElementById("dark").classList.remove("hidden")
    document.body.classList.add("light")
    document.body.classList.remove("dark")
  } 
  else if(mode == "dark") {
    document.getElementById(mode).classList.add("hidden")
    document.getElementById("light").classList.remove("hidden")

    document.body.classList.add("dark")
    document.body.classList.remove("light")
  }
}
function battleBots(){
    startButtonEle.disabled = true
    document.getElementById('botContainer').classList.add("no_opacity")
    document.getElementById('main_info_container').classList.add("no_access")
    side = "w"
    moveAI()
    window.setTimeout(moveCustomBot, 1000)
  }
