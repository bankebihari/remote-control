const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        // ✅ Convert Buffer to string if necessary
        if (message instanceof Buffer) {
            message = message.toString(); // Convert to string
        }

        console.log("Received:", message);

        // Send message to all connected clients
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
