document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-command");
    const urlInput = document.getElementById("yt-url");
    const messageStatus = document.getElementById("message-status");

    let ws;

    function connectWebSocket() {
        ws = new WebSocket("wss://remote-control-7c5u.onrender.com"); // ✅ Correct WebSocket URL

        ws.onopen = () => {
            console.log("✅ WebSocket connected.");
            messageStatus.textContent = "Connected to WebSocket.";
            messageStatus.style.color = "green";
        };

        ws.onmessage = (event) => {
            console.log("📩 Message from server:", event.data);
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
            messageStatus.textContent = "WebSocket error. Try again!";
            messageStatus.style.color = "red";
        };

        ws.onclose = () => {
            console.warn("⚠️ WebSocket closed. Reconnecting...");
            messageStatus.textContent = "Disconnected. Reconnecting...";
            messageStatus.style.color = "orange";
            setTimeout(connectWebSocket, 3000); // Auto-reconnect
        };
    }

    // Establish WebSocket connection when popup loads
    connectWebSocket();

    sendButton.addEventListener("click", () => {
        const videoUrl = urlInput.value.trim();

        // Validate YouTube URL
        if (!videoUrl.includes("youtube.com/watch?v=") && !videoUrl.includes("youtu.be/")) {
            messageStatus.textContent = "❌ Invalid YouTube URL. Please enter a valid link.";
            messageStatus.style.color = "red";
            return;
        }

        if (ws.readyState === WebSocket.OPEN) {
            ws.send("play " + videoUrl);
            console.log("📤 Sent:", videoUrl);
            messageStatus.textContent = "✅ Message sent successfully!";
            messageStatus.style.color = "green";
        } else {
            messageStatus.textContent = "❌ WebSocket not connected!";
            messageStatus.style.color = "red";
            console.error("WebSocket is not open. Current state:", ws.readyState);
        }
    });
});
