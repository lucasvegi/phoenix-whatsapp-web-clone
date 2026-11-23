# phoenix-whatsapp-web-clone

Real-time chat app built with Elixir and Phoenix Channels, featuring a WhatsApp Web-inspired UI. Messages are broadcast instantly to all connected users using WebSockets.

> Academic project developed for the course **INF321 - Design and Development of Web Systems** at Universidade Federal de Viçosa (UFV/Brazil).

---

## Demo

Open two browser windows at the same address and send messages — they appear in real time for all connected users.

---

## Technologies

- [Elixir](https://elixir-lang.org/) — functional and concurrent programming language
- [Phoenix Framework](https://www.phoenixframework.org/) — web framework with native WebSocket support
- [Phoenix Channels](https://hexdocs.pm/phoenix/channels.html) — real-time communication via WebSocket
- Custom CSS with a WhatsApp Web-inspired theme

---

## Prerequisites

Before getting started, make sure you have the following installed:

- [Elixir](https://elixir-lang.org/install.html) >= 1.14
- [Erlang/OTP](https://www.erlang.org/) >= 25
- [Phoenix](https://hexdocs.pm/phoenix/installation.html) >= 1.7

---

## Installation

```bash
# Clone the repository
git clone https://github.com/lucasvegi/phoenix-whatsapp-web-clone.git
cd phoenix-whatsapp-web-clone

# Install dependencies
mix deps.get

# Install JavaScript dependencies
mix assets.setup
```

---

## Running

```bash
# Start the development server
mix phx.server
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

To test the real-time chat, open the same URL in two different tabs or browsers.

---

## How it works

```
User A                       Phoenix Server                    User B
   |                               |                               |
   |── sends message ─────────────>|                               |
   |                               |── broadcast "new_message" ───>|
   |<─────────────────────────────-|                               |
   |   receives own message        |           message appears ───>|
```

1. The client connects to the **Phoenix Channel** `room:geral` via WebSocket.
2. When a message is sent, the `new_message` event is dispatched to the server.
3. The server **broadcasts** the event to all clients connected to the same channel.
4. Each client receives the event and renders the message bubble in the DOM.

---

## Project structure

```
phoenix-whatsapp-web-clone/
├── lib/
│   ├── chat/                        # business logic (contexts)
│   └── chat_web/
│       ├── channels/
│       │   └── room_channel.ex      # real-time chat channel
│       ├── controllers/
│       │   └── page_controller.ex
│       └── page_html/
│           └── home.html.heex       # main chat template
├── assets/
│   ├── css/
│   │   └── app.css                  # styles with WhatsApp theme
│   └── js/
│       └── app.js                   # channel client-side logic
└── mix.exs
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.