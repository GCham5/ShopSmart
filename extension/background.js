let curActiveHostname = "";
let curActiveSubdomain = ""
let curActiveMouseMoves = {}

const startNewPage = (hostname,pathname) => {
    curActiveHostname = hostname
    curActiveSubdomain = pathname

    let path = "";

    if (!Object.keys(curActiveMouseMoves).includes(hostname+pathname+"_#$0")) {
        curActiveSubdomain += '_#$0';
        path = curActiveHostname+curActiveSubdomain;
    } else {
        const allPathsWithSameHostAndSubdomainInCurrentSession = Object.keys(curActiveMouseMoves).filter(key => key.includes(pathname)).sort()
        const hostAndSubdomainLastPage = allPathsWithSameHostAndSubdomainInCurrentSession[allPathsWithSameHostAndSubdomainInCurrentSession.length-1]
        const lastPage = hostAndSubdomainLastPage.substring(hostAndSubdomainLastPage.lastIndexOf('#$')+2,)
        path = hostAndSubdomainLastPage.substring(0,hostAndSubdomainLastPage.lastIndexOf('#$')-1)+"_#$"+(parseInt(lastPage)+1).toString()
    }
    curActiveMouseMoves[path] = []

}

const tabChange = (tabId, url) => {
    let curURL = new URL(url);
    let hostname = curURL.host
    let pathname = curURL.pathname

    chrome.tabs.sendMessage(tabId, {message: "tofg_doyouexist"}, (resp) => {
                
        if (chrome.runtime.lastError) {
            if (hostname != curActiveHostname) { 
                //save to db
                curActiveMouseMoves = {}
            }
            chrome.scripting.insertCSS({
                target: {tabId: tabId},
                files: ["./css/foreground.css"]
            })
            .then(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./foreground.js"]
                })
                .then(() => {
                    chrome.tabs.sendMessage(tabId, { message: "tofg_start_recording"})
                })
            }).catch(err => console.log(err));
        } else {
            if (hostname != curActiveHostname) { 
                //save to db
                curActiveMouseMoves = {}
            }
            chrome.tabs.sendMessage(tabId, { message: "tofg_start_recording"})
        }

        startNewPage(hostname, pathname)
    })             
}

//gone use this one for changing the tab b/w existing tabs (includes when u a close a tab and u auto go to another tab)
chrome.tabs.onActivated.addListener(activeTabInfo => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        if (/^http/.test(tabs[0].url)) {
            tabChange(activeTabInfo.tabId, tabs[0].url);
        }
   })
})


//gonna use this one for when u create a new tab, or when you change the url of the cur tab ur on
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete' && /^http/.test(tab.url)) {
        tabChange(tabId, tab.url);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "tobg_mousemovedata") {
        console.log(request.payload) //this is where we update the curActiveMouseMoves
    }
});