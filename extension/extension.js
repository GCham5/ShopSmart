
const positions = [];
const mousepos = [0,0];
const events = [];
let scrolly = 0;

document.addEventListener('mousemove',(e)=>{
    mousepos[0] = e.pageX;
    mousepos[1] = e.pageY;
});
document.addEventListener('scroll',(e)=>{
    scrolly = window.scrollY;
});
const recordmouseposinterval = setInterval(()=>{
    positions.push([mousepos[0],mousepos[1]+scrolly])
},200);
setTimeout(()=>{
    clearInterval(recordmouseposinterval);
},30000);
document.addEventListener('click',(e)=>{
    let target = e.target;
    console.log(target);
    events.push({type: 'CLICK', target});
});
