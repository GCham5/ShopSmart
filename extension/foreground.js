const mousepos = [0,0];
const events = [];
let scrolly = 0;
let mouseMonitorInterval;

document.addEventListener('mousemove',(e)=>{
    mousepos[0] = e.pageX;
    mousepos[1] = e.pageY;
});
document.addEventListener('scroll',(e)=>{
    scrolly = window.scrollY;
});

// monitorScreen = () => {
//     chrome.runtime.sendMessage({ message: "tobg_force_end_recording"})
// }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'tofg_doyouexist') {
        sendResponse(true)
    } else if (request.message === 'tofg_start_recording') {
        clearInterval(mouseMonitorInterval);
        mouseMonitorInterval = setInterval(() => {
            chrome.runtime.sendMessage({ message: "tobg_mousemovedata", payload: {mousePos: mousepos, curUrl: window.location}})
        }, 100);
        setTimeout(()=>{
            clearInterval(mouseMonitorInterval)
        }, 20000)
    }
})

// change the tabs url manually or by clicking on some hyperlink
// window.onbeforeunload = () => {
//     chrome.runtime.sendMessage({ message: "tobg_force_end_recording"})
// }