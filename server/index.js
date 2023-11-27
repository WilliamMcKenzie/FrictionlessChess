const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8082 });

// Store connected clients
const clients = {};
const rooms = {}

wss.on("connection", ws => {
    console.log("new client connected zehahaha");

    // Generate a unique ID for the client
    const clientId = Math.random().toString(36).substr(2, 9);
    clients[clientId] = ws;

    // Send the client ID to the connected client
    ws.send(JSON.stringify({ type: 'client_id', data: clientId }));

    // Handle incoming messages from the client
    ws.on("message", data => {
        data = JSON.parse(data)

        var message = data.data
        var type = data.type

        if(type == "move"){
            console.log("client has sent us move: " + message);

            Object.keys(clients).forEach(clientId => {
                if (clientId !== ws.clientId) {
                    clients[clientId].send(JSON.stringify({type: "move", data: message}));
                }
            });
        }
        if(type == "createRoom"){
            console.log("client has created room: " + message);
            rooms[message] = [ws]
        }
        if(type == "joinRoom"){
            console.log("client has joined room: " + message);
            if(rooms[message]){
                console.log("room " + message + " members: " + rooms[message]);
                rooms[message].push(ws)
                Object.keys(rooms).forEach(roomID => {
                    if (roomID == message) {
                        rooms[roomID][0].send(JSON.stringify({type: "alert", data: "start"}));
                    }
                });
            }
        }
    });

    // Handle client disconnection
    ws.on("close", () => {
        console.log("disconnected");
        delete clients[clientId];
    });
});