console.log("Client receiver content script loaded.");

function playVideo(url) {
    console.log("Navigating to:", url);
    window.location.href = url;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "play" && message.url) {
        playVideo(message.url);
        sendResponse({ status: "Playing video" });
    }
});
