console.log('INJECTED');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === 'tofg_doyouexist') {
            sendResponse(true)
    }   
})