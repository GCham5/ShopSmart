let curActiveHostname = "";
let curActiveSubdomain = ""
let curActiveMouseMoves = {}
let curActiveActions = {}

const startNewPage = (hostname,pathname) => {
    curActiveHostname = hostname
    curActiveSubdomain = pathname
    let path = "";

    if (!Object.keys(curActiveMouseMoves).includes(hostname+pathname+"_#$0")) {
        curActiveSubdomain += '_#$0';
    } else {
        const allPathsWithSameHostAndSubdomainInCurrentSession = Object.keys(curActiveMouseMoves).filter(key => key.includes(pathname)).sort()
        const hostAndSubdomainLastPage = allPathsWithSameHostAndSubdomainInCurrentSession[allPathsWithSameHostAndSubdomainInCurrentSession.length-1]
        const lastPageSubdomain = hostAndSubdomainLastPage.substring(hostAndSubdomainLastPage.indexOf(curActiveHostname)+curActiveHostname.length,)
        const lastPageNumber = parseInt(lastPageSubdomain.substring(lastPageSubdomain.lastIndexOf("_#$")+3,))
        curActiveSubdomain = lastPageSubdomain.substring(0,lastPageSubdomain.lastIndexOf("_#$"))+"_#$"+(lastPageNumber+1).toString()
    }
    path = curActiveHostname+curActiveSubdomain;
    curActiveMouseMoves[path] = []
    curActiveActions[path] = []
}

getDataFromDb = (tabId, hostname, pathname) => {
    allDataForActiveTab = []
    chrome.tabs.sendMessage(tabId, {message: "tofg_gettestdata"}, (resp) => {
        const testData = JSON.parse(resp);
        const matchingDomains = testData.domains.filter(domain => domain.domain === hostname);
        matchingDomains.forEach(domain => {
            domain.sessions.forEach(session => {
                session.pages.forEach(page => {
                    if (page.subdomain === pathname) {
                        allDataForActiveTab.push({sessionId: domain.id, pageId: page.id, bWidth: session.bWidth, mousePos: page.mousePos})
                    }
                })
            })
        })
        chrome.tabs.sendMessage(tabId, {message: "tofg_sessiondataforpage", payload: {sessionDataforPage: allDataForActiveTab}})
    })
}

const tabChange = (tabId, url) => {
    let curURL = new URL(url);
    let hostname = curURL.host
    let pathname = curURL.pathname

    chrome.tabs.sendMessage(tabId, {message: "tofg_doyouexist"}, (resp) => {
                
        if (chrome.runtime.lastError) {
            if (hostname != curActiveHostname) { 
                //save to db
                curActiveActions = []
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
                    getDataFromDb(tabId,hostname,pathname)

                })
            }).catch(err => console.log(err));
        } else {
            if (hostname != curActiveHostname) { 
                //save to db
                curActiveActions = []
                curActiveMouseMoves = {}
            }
            chrome.tabs.sendMessage(tabId, { message: "tofg_start_recording"})
            getDataFromDb(tabId,hostname,pathname)
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
        curActiveMouseMoves[curActiveHostname+curActiveSubdomain].push(request.payload.mousePos)
    } else if (request.message == "tobg_action") {
        console.log(request.payload)
        curActiveActions[curActiveHostname+curActiveSubdomain].push(request.payload)
    }
});