import { formatUserInput } from "../utils/formatUserInput.js"
import { fetchData } from "../utils/fetchData.js"
import { convertToBase64 } from "../utils/convertToBase64.js"
import { paperText } from "../data/paperText.js"

const computerScreen = document.querySelector(".computer-screen")
const computerContainer = document.querySelector(".computer-container")
const walkthroughPaper = document.querySelector(".walkthrough-paper")
const thirdPaperPiece = walkthroughPaper.querySelector(".paper-piece-3")

let userInput = returnUserInput()
let inputCaret = returnInputCaret()
let isProgramRunning = false
let stopProgram = false
let isAnimationRunning = false
let isHidden = true
const commandsInfo = {previous: [], currentIndex: -1}

const keyboardSound = new Audio("./assets/sounds/keyboard_sound.ogg")
const paperFoldSound = new Audio("./assets/sounds/paper_fold.wav")
const paperUnfoldSound = new Audio("./assets/sounds/paper_unfold.wav")
const cancelBeepSound = new Audio("./assets/sounds/cancel_beep.wav")
const errorBeepSound = new Audio("./assets/sounds/error_beep.wav")
keyboardSound.volume = 0.5

const terminalCommands = {
   "cls": clearTerminal,
   "clear": clearTerminal,
   "theme": (color) => changeTerminalTheme(color)
}

walkthroughPaper.querySelector(".paper-text").innerHTML = paperText
thirdPaperPiece.addEventListener("click", handlePaperClick)

setInterval(() => {
   const verticalRollEffect = document.querySelector(".vertical-roll")
   verticalRollEffect.style.animation = "verticalRoll 2s forwards linear"
   setTimeout(() => verticalRollEffect.style.animation = "", 2500)
}, 12000);

function handlePaperClick() {
   const elements = [walkthroughPaper, ...walkthroughPaper.querySelectorAll("div:not(:nth-child(4))")]
   const elementsClassNames = elements.map(element => element.className.split(" ").filter((_, index) => index === 0)).flat()
   const newInputCaret = returnInputCaret()

   function showInputCaret() {
      document.body.prepend(newInputCaret)
      userInput.focus()
      setInputCaretPosition()
   }

   function changeClickableElement(element, type) {
      type === "add" ? element.addEventListener("click", handlePaperClick) : element.removeEventListener("click", handlePaperClick)
      type === "add" ? element.style.cursor = "pointer" : element.style.cursor = "default"
   }

   if (!isAnimationRunning) {
      isAnimationRunning = true
      inputCaret.remove()

      if (!isHidden) {
         elements.forEach((element, index) => element.className = `${elementsClassNames[index]} hidePaperAnimation`)
         paperFoldSound.play()
         changeClickableElement(walkthroughPaper, "remove")

         setTimeout(() => {
            elements.forEach((element, index) => element.className = `${elementsClassNames[index]} hiddenPaper`)
            computerContainer.style.transform = "translateX(-38px)"
            changeClickableElement(thirdPaperPiece, "add")

            setTimeout(() => {
               showInputCaret()
               isAnimationRunning = false
               isHidden = true
            }, 500);
         }, 2500);
      } else {
         elements.forEach((element, index) => element.className = `${elementsClassNames[index]} hiddenPaper showPaperAnimation`)
         computerContainer.style.transform = "translateX(0)"
         paperUnfoldSound.play()
         changeClickableElement(thirdPaperPiece, "remove")

         setTimeout(() => {
            elements.forEach((element, index) => element.className = `${elementsClassNames[index]} showPaperAnimation`)
            changeClickableElement(walkthroughPaper, "add")

            showInputCaret()
            isAnimationRunning = false
            isHidden = false
         }, 3500);
      }
   }
}

focusOnUserInput("click")
focusOnUserInput("mouseenter")

handleInputListener("add", "keydown", onInputKeydown)
handleInputListener("add", "keyup", onInputKeyup)

computerScreen.addEventListener("scroll", () => {
   const scrollLimit = (computerScreen.scrollHeight - computerScreen.clientHeight) - 5

   if (Math.ceil(computerScreen.scrollTop) < scrollLimit) {
      inputCaret.style.visibility = "hidden"
   } else {
      inputCaret.style.visibility = "visible"
      setInputCaretPosition()
   }
})

window.addEventListener("keydown", (e) => {
   if (!e.repeat) {
      keyboardSound.currentTime = 0
      keyboardSound.play()
   }

   if (e.ctrlKey && e.key === "c") {
      if (isProgramRunning) {
         cancelBeepSound.play()
         stopProgram = true
      }
   }
})

function handleInputListener(type, eventName, callback) {
   type === "add" ? userInput.addEventListener(eventName, callback) : userInput.removeEventListener(eventName, callback)
}

function onInputKeydown(e) {
   const inputContent = userInput.textContent.replace("\u200B", "").trim()

   if (e.key === " " || (e.ctrlKey && e.key === "v")) e.preventDefault()

   if (commandsInfo.previous.length > 0) {
      if (e.key === "ArrowUp") {
         if (commandsInfo.currentIndex < commandsInfo.previous.length - 1) commandsInfo.currentIndex++
         userInput.textContent = `\u200B${commandsInfo.previous[commandsInfo.currentIndex]}`
      }

      if (e.key === "ArrowDown") {
         if (commandsInfo.currentIndex >= 0) commandsInfo.currentIndex--
         userInput.textContent = commandsInfo.currentIndex === -1 ? "\u200B" : `\u200B${commandsInfo.previous[commandsInfo.currentIndex]}`
      }
   }

   if (e.key === "Enter") {
      e.preventDefault()
      commandsInfo.currentIndex = -1

      if (inputContent !== "") {
         handleInputListener("remove", "keydown", onInputKeydown)
         handleInputListener("remove", "keyup", onInputKeyup)
         handleUserInput(inputContent)
      }
   }

   inputCaret.style.animation = "none"
}

function onInputKeyup(e) {
   if (e.key === "ArrowUp") window.getSelection().collapse(userInput.firstChild, userInput.firstChild.textContent.length)
   if (userInput.textContent === "") userInput.textContent = "\u200B"

   inputCaret.style.animation = "blink 1s infinite steps(1)"
   setInputCaretPosition()
}

function returnUserInput() {
   return document.querySelector(".user-input")
}

function returnInputCaret() {
   return document.querySelector(".input-caret")
}

function setInputCaretPosition() {
   const selection = window.getSelection()

   if (!selection.rangeCount) return

   const range = selection.getRangeAt(0)
   const rect = range.getClientRects()[0]

   if (!rect) return

   inputCaret.style.top = rect.top + "px"
   inputCaret.style.left = rect.left + "px"
}

function focusOnUserInput(eventName) {
   computerScreen.addEventListener(eventName, () => {
      userInput.focus()
      setInputCaretPosition()
   })
}

function clearTerminal() {
   const inputWrapper = document.querySelector(".input-wrapper")
   computerScreen.innerHTML = ""
   inputCaret.remove()
   createUserInput(inputWrapper.cloneNode(true), inputCaret.cloneNode())
}

function changeTerminalTheme(color) {
   const link = createElement("link")
   link.rel = "stylesheet"
   link.href = `./css/${color}.css`
   document.head.replaceChild(link, document.head.querySelector("link[href='./css/style.css'").nextElementSibling)
   writeTextOnScreen(`[INFO] Theme "${color}" has been applied.`)
}

async function handleUserInput(inputContent) {
   const inputWrapper = document.querySelector(".input-wrapper")
   const transformedContent = formatUserInput(inputContent)
   const lowercaseContent = inputContent.toLowerCase()
   const includesCommand = commandsInfo.previous.includes(inputContent)

   if (includesCommand) commandsInfo.previous = commandsInfo.previous.filter(command => command !== inputContent)

   commandsInfo.previous.unshift(inputContent)

   if (transformedContent) {
      if (transformedContent.method === "POST" && (transformedContent.route.includes("/compress") || transformedContent.route.includes("/decompress"))) {
         await handleFilePicker(transformedContent.route, transformedContent)
      } else {
         const responseData = await fetchData(transformedContent, "application/json")
         writeTextOnScreen(responseData)
      }
   } else {
      let inputObj = null
      let errorMessage = null

      if (lowercaseContent.includes("=")) inputObj = Object.fromEntries([lowercaseContent.split("=")])

      const commandAction = terminalCommands[inputObj ? Object.keys(inputObj)[0] : lowercaseContent]

      if (commandAction) {
         const terminalThemes = ["green", "amber", "cyan"]

         if (inputObj && inputObj.theme) {
            if (terminalThemes.includes(inputObj.theme))  {
               commandAction(inputObj.theme)
            } else {
               errorMessage = `[ERROR] Unrecognized command: "${inputContent}".\nPlease check the documentation for valid commands.`
            }
         } else {
            commandAction()
            if (lowercaseContent === "cls" || lowercaseContent === "clear") return
         }
      } else {
         errorMessage = `[ERROR] Unrecognized command: "${inputContent}".\nPlease check the documentation for valid commands.`
      }

      if (errorMessage) {
         errorBeepSound.play()
         writeTextOnScreen(errorMessage)
      }
   }

   userInput.textContent = ""
   inputCaret.remove()
   inputWrapper.remove()
}

function createUserInput(inputWrapperClone, inputCaretClone) {
   computerScreen.appendChild(inputWrapperClone)
   document.body.prepend(inputCaretClone)

   userInput = returnUserInput()
   userInput.textContent = "\u200B"
   userInput.focus()
   inputCaret = inputCaretClone
   setInputCaretPosition()

   handleInputListener("add", "keydown", onInputKeydown)
   handleInputListener("add", "keyup", onInputKeyup)   
}

function createElement(element, className) {
   const newElement = document.createElement(element)
   if (className) newElement.className = className
   return newElement
}

function createDownloadAnchor(href, downloadName) {
   const anchorElement = createElement("a")
   anchorElement.display = "none"
   anchorElement.href = href
   anchorElement.download = downloadName
   anchorElement.click()
   document.body.appendChild(anchorElement)
   setTimeout(() => document.body.removeChild(anchorElement), 1000)
}

async function handleFilePicker(route, userInputContent) {
   try {
      const filePickerConfig = route.includes("/compress") ? {startIn: "downloads"} : {startIn: "downloads", excludeAcceptAllOption: true, types: [{description: "GZIP files", accept: {"application/gzip": [".gz"]}}]}
      const [fileHandle] = await window.showOpenFilePicker(filePickerConfig)
      const file = await fileHandle.getFile()
      const arrayBuffer = await file.arrayBuffer()
      const encodedContent = convertToBase64(arrayBuffer)

      const responseBody = {name: file.name, size: file.size, content: encodedContent}
      const responseData = await fetchData({...userInputContent, body: responseBody}, "application/octet-stream")
      writeTextOnScreen(responseData)

      const newFileName = route.includes("/compress") ? `${file.name}.gz` : file.name.split(".gz")[0]
      const fetchedFile = await (await fetch(`http://localhost:3000${`/temp/${encodeURIComponent(newFileName)}`}`)).blob()
      const newFileURL = URL.createObjectURL(fetchedFile)

      createDownloadAnchor(newFileURL, newFileName)
      setTimeout(() => URL.revokeObjectURL(newFileURL), 1000);
   } catch (error) {
      errorBeepSound.play()
      writeTextOnScreen(`[ERROR] Please select a file to continue.`)
   }
}

function writeTextOnScreen(text) {
   const inputWrapperClone = document.querySelector(".input-wrapper").cloneNode(true)
   const inputCaretClone = inputCaret.cloneNode()
   const screenRouteName = createElement("p", "route-name")
   const screenContent = createElement("p", "content")
   const userInputContent = createElement("p", "content")
   const textLength = text.text ? text.text.length : text.length
   let currentLetterIndex = 0

   userInputContent.textContent = `> ${inputWrapperClone.lastElementChild.textContent}\n`
   text.text ? computerScreen.append(userInputContent, screenRouteName, screenContent) : computerScreen.append(userInputContent, screenContent)
   isProgramRunning = true

   if (text.routeName) {
      const errorRoute = "_______________/_\\'__|'__/_\\|'__||__/||||(_)||\\___|_||_|\\___/|_|"
      if (text.routeName.trim().replaceAll("\n", "").replaceAll(" ", "") === errorRoute) errorBeepSound.play()
      screenRouteName.textContent = text.routeName
   }

   const intervalId = setInterval(() => {
      if (currentLetterIndex === textLength - 1 || stopProgram) {
         clearInterval(intervalId)
         createUserInput(inputWrapperClone, inputCaretClone)
         stopProgram = false
         isProgramRunning = false
      }

      screenContent.textContent += text.text ? text.text[currentLetterIndex] : text[currentLetterIndex]
      computerScreen.scrollTop = computerScreen.scrollHeight - computerScreen.clientHeight
      currentLetterIndex++
   }, 10);
}