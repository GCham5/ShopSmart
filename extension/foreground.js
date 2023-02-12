const mousepos = [0,0];
const events = [];
let scrolly = 0;
let mouseMonitorInterval;
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

const drawHeatMapSquare = (ctx, x, y) => {
    const col = Math.floor(x/gridSize)
    const row = Math.floor(y/gridSize)
    ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
    ctx.fillRect(col*gridSize, row*gridSize, gridSize, gridSize);
};

generateHeatMap = () => {
    const canvas = document.createElement('CANVAS')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = "0";
    canvas.style.zIndex="99999999";
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    sessionDataforPage.mousePos.forEach(mousePos => {
        drawHeatMapSquare(ctx,mousePos[0], mousePos[1])
    })
    // ctx.fillRect(0,0,500,500)
    document.getElementsByTagName('body')[0].appendChild(canvas)

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'tofg_doyouexist') {
        sendResponse(true)
    } else if (request.message === 'tofg_start_recording') {
        clearInterval(mouseMonitorInterval);
        mouseMonitorInterval = setInterval(() => {
            chrome.runtime.sendMessage({ message: "tobg_mousemovedata", payload: {mousePos: [mousepos[0],mousepos[1]+scrolly]}})
        }, 100);
        setTimeout(()=>{
            clearInterval(mouseMonitorInterval)
        }, 120000)
    } else if (request.message === "tofg_sessiondataforpage") {
        sessionDataforPage = request.payload.sessionDataforPage[0];
    } else if (request.message === "tofg_gettestdata") {
        sendResponse(localStorage.getItem('testData'))
    } else if (request.message == "tofg_generateheatmap") {
        if(!heatmapactive) {
            heatmapactive = true
            generateHeatMap();
        } else {
            const canvas = document.getElementsByTagName('canvas')[0]
            canvas.parentElement.removeChild(canvas)
            heatmapactive = false
        }
    }
})
