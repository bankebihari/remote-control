const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");

const PORT = process.env.PORT || 10000;


const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log("Received:", message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
