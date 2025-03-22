let ws;

function connectWebSocket() {
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
        ws.send("play " + videoUrl);
        console.log("Sent:", videoUrl);
        messageStatus.textContent = "✅ Message sent successfully!";
        messageStatus.style.color = "green";
    };
    

    ws.onmessage = (event) => {
        console.log("Message received in background script:", event.data);
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
        console.warn("WebSocket closed. Reconnecting in 3 seconds...");
        setTimeout(connectWebSocket, 3000);
    };
}

// Attempt to connect
connectWebSocket();
