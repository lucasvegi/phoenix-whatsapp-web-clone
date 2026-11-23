// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//
// If you have dependencies that try to import CSS, esbuild will generate a separate `app.css` file.
// To load it, simply add a second `<link>` to your `root.html.heex` file.

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import {hooks as colocatedHooks} from "phoenix-colocated/chat"
import topbar from "../vendor/topbar"

const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
const liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken},
  hooks: {...colocatedHooks},
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

// The lines below enable quality of life phoenix_live_reload
// development features:
//
//     1. stream server logs to the browser console
//     2. click on elements to jump to their definitions in your code editor
//
if (process.env.NODE_ENV === "development") {
  window.addEventListener("phx:live_reload:attached", ({detail: reloader}) => {
    // Enable server log streaming to client.
    // Disable with reloader.disableServerLogs()
    reloader.enableServerLogs()

    // Open configured PLUG_EDITOR at file:line of the clicked element's HEEx component
    //
    //   * click with "c" key pressed to open at caller location
    //   * click with "d" key pressed to open at function component definition location
    let keyDown
    window.addEventListener("keydown", e => keyDown = e.key)
    window.addEventListener("keyup", _e => keyDown = null)
    window.addEventListener("click", e => {
      if(keyDown === "c"){
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtCaller(e.target)
      } else if(keyDown === "d"){
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtDef(e.target)
      }
    }, true)

    window.liveReloader = reloader
  })
}

// 1. Cria a conexão WebSocket
const socket = new Socket("/socket")
socket.connect()

// 2. Cria o canal
const channel = socket.channel("room:geral", {})

// 3. Recupera os elementos HTML
const form = document.getElementById("message-form")
const input = document.getElementById("message-input")
const nameInput = document.getElementById("name-input")
const messages = document.getElementById("messages")
const button = document.getElementById("btn-submit")

// Impede o envio antes da entrada no canal
input.disabled = true
nameInput.disabled = true
button.disabled = true

// 4. Registra o recebimento de mensagens
channel.on("new_message", payload => {
  const item = document.createElement("li")

  // identifica se a mensagem é do próprio usuário ou de outro
  const isMe = payload.name === nameInput.value.trim()
  item.classList.add(isMe ? "msg-sent" : "msg-received")

  // nome (só nas mensagens recebidas)
  if (!isMe) {
    const name = document.createElement("span")
    name.classList.add("msg-name")
    name.textContent = payload.name
    item.appendChild(name)
  }

  // texto da mensagem
  const text = document.createElement("span")
  text.textContent = payload.message 
  item.appendChild(text)

  // horário
  const time = document.createElement("span")
  time.classList.add("msg-time")
  const now = new Date()
  time.textContent = now.getHours().toString().padStart(2, "0") + ":" +
                     now.getMinutes().toString().padStart(2, "0")
  if (isMe) time.textContent += " ✓✓"
  item.appendChild(time)

  messages.appendChild(item)
  messages.scrollTop = messages.scrollHeight
})

// 5. Solicita a entrada no canal
channel.join()
  .receive("ok", () => {
    console.log("Entrou na sala")
    input.disabled = false
    nameInput.disabled = false
    button.disabled = false
  })
  .receive("error", response => {
    console.error("Falha:", response)
  })

// 6. Captura o envio do formulário
form.addEventListener("submit", event => {
  event.preventDefault()
  const message = input.value.trim()
  const name = nameInput.value.trim()
  if (message === "" || name === "") return
  channel.push("new_message", {message: message, name: name})
  input.value = ""
  input.focus()
})





