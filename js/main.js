var paint = new Paint(document.querySelector("#canvas"));
paint.setCanvasAutoresize(true, 1, 0.94);
var penclick = false;

var pen = false;
document.querySelector('#pen').addEventListener('click', ()=>{
    penclick = true;
    pen = !pen;
    if(pen)
        paint.pen();
    else
        paint.removeCanvasEvents();
    });

document.querySelector('#undo').addEventListener('click', ()=>{
    paint.undo();
});
document.querySelector('#reundo').addEventListener('click', ()=>{
    paint.reundo();
});
document.querySelector('#download').addEventListener('click', ()=>{
    paint.saveAsPNG();
});

var toolsState = false;
var tools = document.querySelector("#tools");
var list = [];
tools.addEventListener("click", ()=>{
    toolsState = !toolsState;
    if(toolsState)
        tool();
    else
        list.forEach(element => {
            element.remove();
        });
});

function tool(){
    var container = document.createElement('div');
    var thick = document.createElement('input');
    var color = document.createElement('input');
    color.addEventListener('change', ()=>{
        paint.setColor(color.value);
    });
    thick.addEventListener('change', ()=>{
        paint.setThickness(thick.value);
    });
    color.type = "color";
    color.style.width = "100px";
    thick.placeholder = "Pick a thickness";
    thick.style.width = "100px";
    container.style.position = "absolute";
    container.style.marginTop = "4%";
    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr";
    container.style.gridTemplateRows = "1fr 1fr";

    tools.parentNode.insertBefore(container, tools.nextSibling);
    container.appendChild(thick);
    container.appendChild(color);

    list.push(container);
    list.push(thick)
    list.push(color)
}


setTimeout(()=>{
    document.querySelector('p').textContent = "Press pen icon to draw!";
}, 2000)



var pen23 = document.querySelector('#pen');
pen23.addEventListener('click', check);
var text = document.getElementById('text');


function check(){
    setTimeout(()=>{
        if(!penclick)
            check
        else{
            pen23.removeEventListener('click', check);
            text.textContent = "Yeah! just like that.";
            setTimeout(()=>{
                text.textContent = "Ok, Now have some fun with it! I will go silent.";
                setTimeout(()=>{
                    document.querySelector('#text').remove();
                }, 6000)

            }, 2000);
        }

    }, 200);
}
