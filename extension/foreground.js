const mousepos = [0,0];
const events = [];
let scrolly = 0;
let mouseMonitorInterval;
let sessionTimer = 0;
let sessionTimerInterval;
let sessionDataforPage = {}
const gridSize = 50
let heatmapactive = false;

document.addEventListener('mousemove',(e)=>{
    mousepos[0] = e.pageX;
    mousepos[1] = e.pageY;
});
document.addEventListener('scroll',(e)=>{
    scrolly = window.scrollY;
});

document.body.addEventListener('click', (e) => {
    const item = e.target
    const hasChildren = item.children.length > 0;

    let inner = "";
    if (hasChildren) {
        inner = item.innerHTML
        item.innerHTML = ''
    }
    const outer = item.outerHTML;
    if (hasChildren) {
        item.innerHTML = inner;
    }
    
    chrome.runtime.sendMessage({ message: "tobg_action", payload: {target: outer, time: sessionTimer, type:'click'}})
})


const drawHeatMapSquare = (ctx, x, y, bWidth) => {
    const col = Math.floor((x/(bWidth/window.innerWidth))/gridSize)
    const row = Math.floor(y/gridSize)
    ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
    ctx.fillRect(col*gridSize, row*gridSize, gridSize, gridSize);
};

generateHeatMap = (sessionId, pageId) => {
    const canvas = document.createElement('CANVAS')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = "0";
    canvas.style.zIndex="99999999";
    const ctx = canvas.getContext('2d');

    const relevantSessionPageData = sessionDataforPage.find(sessionPageData => sessionPageData.sessionId == sessionId && sessionPageData.pageId === pageId)

    relevantSessionPageData.mousePos.forEach(mousePos => {
        drawHeatMapSquare(ctx,mousePos[0], mousePos[1], relevantSessionPageData.bWidth)
    })

    // ctx.fillStyle="black";
    // ctx.fillRect(0,0,500,500)
    document.getElementsByTagName('body')[0].appendChild(canvas)

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'tofg_doyouexist') {
        sendResponse(true)
    } else if (request.message === 'tofg_start_recording') {
        clearInterval(mouseMonitorInterval);
        clearInterval(sessionTimerInterval);
        mouseMonitorInterval = setInterval(() => {
            chrome.runtime.sendMessage({ message: "tobg_mousemovedata", payload: {mousePos: [mousepos[0],mousepos[1]+scrolly]}})
        }, 100);
        sessionTimerInterval = setInterval(() => {
            sessionTimer += 1;
        }, 1000)
        setTimeout(()=>{
            clearInterval(mouseMonitorInterval)
        }, 120000)
    } else if (request.message === "tofg_sessiondataforpage") {
        sessionDataforPage = request.payload.sessionDataforPage;
    } else if (request.message === "tofg_gettestdata") {
        sendResponse(localStorage.getItem('testData'))
    } else if (request.message == "tofg_generateheatmap") {
        if(!heatmapactive) {
            heatmapactive = true
            generateHeatMap(request.payload.sessionId, request.payload.pageId);
        } else {
            const canvas = document.getElementsByTagName('canvas')[0]
            canvas.parentElement.removeChild(canvas)
            heatmapactive = false
        }
    } else if (request.message === "tofg_getallsessionpageids") {
        const sessionPageIds = []
        sessionDataforPage.forEach(sessionPageData => {
            sessionPageIds.push({sessionId: sessionPageData.sessionId, pageId: sessionPageData.pageId})
        })
        sendResponse({sessionPageIds: sessionPageIds})
    }
 })
