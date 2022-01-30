/**
 * Paint Class
 * 
 * @setCanvasAutoresize (bool, multiplierX, multiplierY) - set true or false of canvas to auto resize when window is resized and multipliers for x, y/ width, height.  
 * @pen () - Select pen tool.
 * @setPenColor (color) - Sets pen drawing color. Uses a hex version, but works html color words as well.
 * @setPenThickness (thickness) - Sets the thickness of pen. Accepts int and floats numbers.
 * @removeEvents () - Removes all events created. This method will break tools functionalities.
 * @saveAsPNG () - Save localy the canvas as png image.
 * @undo () - It sets canvas in a state before drawing last line.
 * @reundo () - It sets canvas in a state closer to last drawed line (if undo was used right before).
 */
class Paint{
    constructor(element){
        this.canvas = element;
        this.ctx = this.canvas.getContext('2d');
        this.eventFunctions = [];
        this.lineColor = "#000000";
        this.lineWidth = 2;
        this.history = [];
        this.historyIndex = -1;

        this.temp_canvas = document.createElement('canvas');
        this.temp_ctx = this.temp_canvas.getContext('2d');
        this.temp_canvas.width = this.canvas.width;
        this.temp_canvas.height = this.canvas.height;
    }
    /**
     * 
     * @param {boolean} bool 
     * @param {number} xMultiplier 
     * @param {number} yMultiplier
     * 
     * @description
     * - Default value of x,y Multipiers is 1.
     * - Default value of bool is flase. 
     */
    setCanvasAutoresize = (bool=false, xMultiplier = 1, yMultiplier = 1) =>{
        if(bool){
            this.canvas.width = innerWidth * xMultiplier;
            this.canvas.height = innerHeight * yMultiplier;
            window.addEventListener('resize', ()=>{
                this.temp_canvas.width = innerWidth * xMultiplier;
                this.temp_canvas.height = innerHeight * yMultiplier;
                this.temp_ctx.drawImage(this.canvas, 0, 0);

                this.canvas.width = innerWidth * xMultiplier;
                this.canvas.height = innerHeight * yMultiplier;
                this.ctx.drawImage(this.temp_canvas, 0, 0);
            });
        }
    }
    /**
     * @description Selects the pen tool.
     */
    pen = ()=>{
        this.removeCanvasEvents(); 
        this.canvas.addEventListener('mousedown', this.penStartDraw);
        this.canvas.addEventListener('mouseup', this.penStopDraw);
        this.canvas.addEventListener('mousemove', this.penDraw);
        this.canvas.addEventListener('mouseleave', this.penStopDraw);

        this.canvas.addEventListener('touchstart', this.penStartDraw);
        this.canvas.addEventListener('touchend', this.penStopDraw);
        this.canvas.addEventListener('touchmove', this.penDraw);
        this.canvas.addEventListener('touchcancel', this.penStopDraw);

        this.eventFunctions.push({"name":'mousedown', "method":this.penStartDraw});
        this.eventFunctions.push({"name":'mouseup', "method":this.penStopDraw});
        this.eventFunctions.push({"name":'mousemove', "method":this.penDraw});
        this.eventFunctions.push({"name":'mouseleave', "method":this.penStopDraw});

        this.eventFunctions.push({"name":'touchstart', "method":this.penStartDraw});
        this.eventFunctions.push({"name":'touchend', "method":this.penStopDraw});
        this.eventFunctions.push({"name":'touchmove', "method":this.penDraw});
        this.eventFunctions.push({"name":'touchcancel', "method":this.penStopDraw});
    }
    penDraw = e=>{
        if(!this.penDrawing) 
            return;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineTo(e.clientX, e.clientY-18);
        this.ctx.stroke();
    }
    penStartDraw = e=>{
        this.history.splice(this.historyIndex, this.history.length - this.historyIndex);

        this.penDrawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX, e.clientY-18);
        this.penDraw(e);
    }
    penStopDraw = e=>{
        this.penDrawing = false;
        this.addCanvasToHistory();

    }

    /**
     * Selects the line tool.
     */
    line = ()=>{
        this.removeCanvasEvents();
        this.canvas.addEventListener('mousedown', this.lineStartDraw);
        this.canvas.addEventListener('mouseup', this.lineStopDraw);
        this.canvas.addEventListener('mousemove', this.lineDraw);
    }
    lineStartDraw = e=>{
        
    }
    lineStopDraw = e=>{

    }
    lineDraw = e=>{

    }


    //general methods
    addCanvasToHistory(){
        this.temp_canvas = document.createElement('canvas');
        this.temp_ctx = this.temp_canvas.getContext('2d');
        this.copyCanvas();
        var historys = this.temp_canvas;
        this.history.push(historys);
        this.historyIndex += 1;

    }
    undo = ()=>{

        if(this.historyIndex == this.history.length)
            this.historyIndex --;
        if(this.historyIndex > 0){
            this.historyIndex = this.historyIndex - 1;
            this.canvas.width = this.history[this.historyIndex].width;
            this.canvas.height = this.history[this.historyIndex].height;

            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.history[this.historyIndex], 0, 0);
            
        }
        else{
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.historyIndex = 0;
        }
        

    }
    reundo = ()=>{
        if(this.historyIndex < this.history.length-1){
            this.historyIndex = this.historyIndex + 1;
            this.canvas.width = this.history[this.historyIndex].width;
            this.canvas.height = this.history[this.historyIndex].height;

            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.history[this.historyIndex], 0, 0);
            
        }
        else{
            this.historyIndex = this.history.length - 1;
        }
        

    }

    removeCanvasEvents(){
        this.eventFunctions.forEach(event => {
            this.canvas.removeEventListener(event.name, event.method);
        });
        delete this.eventFunctions;
        this.eventFunctions = [];
    }

    /**
     * 
     * @param {string} color
     * @description
     * Changes the color tools uses.
     * Uses hex colors or html predefined words.
     */
     setColor = color=>{
        this.lineColor = color;
    }
    /**
     * 
     * @param {number} thickness 
     * @description
     * It changes the thickness that tool uses. Accepts int or float.
     */
    setThickness = thickness =>{
        this.lineWidth = thickness;
    }

    copyCanvas = ()=>{
        this.temp_canvas.width = this.canvas.width;
        this.temp_canvas.height = this.canvas.height;
        this.temp_ctx.drawImage(this.canvas, 0, 0);
    }
    /**
     * @description It saves localy the canvas as png image.
     */
    saveAsPNG = ()=>{
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'draw.png');
        let canvas = this.canvas;
        let dataURL = canvas.toDataURL('image/png');
        let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
        downloadLink.setAttribute('href',url);
        downloadLink.click();
    }
    
}
