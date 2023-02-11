const tabChange = (tabId, event) => {
    console.log(event)
    chrome.tabs.sendMessage(tabId, {message: "tofg_doyouexist"}, (resp) => {
        if (chrome.runtime.lastError) {
            chrome.scripting.insertCSS({
                target: {tabId: tabId},
                files: ["./css/foreground.css"]
            })
            .then(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./foreground.js"]
                })
            }).catch(err => console.log(err));
        }
    })             
}

//gone use this one for changing the tab b/w existing tabs (includes when u a close a tab and u auto go to another tab)
chrome.tabs.onActivated.addListener(activeTabInfo => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        if (/^http/.test(tabs[0].url)) {
            tabChange(activeTabInfo.tabId, "onActivated");
        }
   })
})


//gonna use this one for when u create a new tab, or when you change the url of the cur tab ur on
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete' && /^http/.test(tab.url)) {
        tabChange(tabId, "onUpdated");
    }
});