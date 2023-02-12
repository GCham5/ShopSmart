document.getElementById("btn").addEventListener('click', ()=>{
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        if (/^http/.test(tabs[0].url)) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "tofg_generateheatmap"})
        }
   })
})