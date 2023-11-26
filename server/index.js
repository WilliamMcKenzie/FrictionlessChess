const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8082 })

wss.on("connection", ws => {
    console.log("new client connected zehahaha")

    //message client sent to server
    ws.on("message", data => {
        console.log("client has sent us data: " + data)

        ws.send(data + " is your name?")
    })

    ws.on("close", () => {
        console.log("disconnected")
    })
}) 