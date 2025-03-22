let ws;

function connectWebSocket() {
    try {
        const ws = new WebSocket("wss://remote-control-7c5u.onrender.com");


        ws.onopen = () => {
            console.log("Client Receiver WebSocket connected");
        };

        ws.onmessage = (event) => {
            let message = event.data;

            if (typeof message !== "string") {
                try {
                    message = JSON.stringify(message);
                } catch (err) {
                    console.error("Error converting message to string:", err);
                    return;
                }
            }

            console.log("Command received:", message);

            if (message.startsWith("play ")) {
                const videoUrl = message.replace("play ", "");

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        const tab = tabs[0];

                        // 🚨 If the tab is a chrome:// page, open YouTube in a new tab
                        if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
                            console.warn("Invalid tab detected. Opening YouTube in a new tab...");
                            chrome.tabs.create({ url: videoUrl }, (newTab) => {
                                setTimeout(() => {
                                    chrome.scripting.executeScript({
                                        target: { tabId: newTab.id },
                                        function: playVideo,
                                        args: [videoUrl]
                                    }).catch((error) => console.error("Execution script error:", error));
                                }, 2000); // Give time for the page to load
                            });
                            return;
                        }

                        // Execute script on valid webpage
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            function: playVideo,
                            args: [videoUrl]
                        }).catch((error) => console.error("Execution script error:", error));
                    } else {
                        console.error("No active tab found.");
                    }
                });
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.warn("WebSocket closed. Reconnecting in 3 seconds...");
            setTimeout(connectWebSocket, 3000);
        };
    } catch (err) {
        console.error("WebSocket connection failed:", err);
    }
}

function playVideo(videoUrl) {
    console.log("Playing video:", videoUrl);
    window.location.href = videoUrl;
}

// Start WebSocket connection
connectWebSocket();
