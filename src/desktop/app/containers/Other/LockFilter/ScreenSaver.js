function ScreenSaver (settings) {
    this.settings = settings;     
			
    this.nTimeout = this.settings.timeout;
    this.callBack = this.settings.callBack;

    document.body.screenSaver = this;     
    // link in to body events     
    document.body.onmousemove = ScreenSaver.prototype.onevent;     
    document.body.onmousedown = ScreenSaver.prototype.onevent;     
    document.body.onkeydown = ScreenSaver.prototype.onevent;     
    document.body.onkeypress = ScreenSaver.prototype.onevent;   
            
    var pThis = this;  
    var f = function(){
        pThis.timeout();
    }

    this.timerID = window.setTimeout(f, this.nTimeout);
}

ScreenSaver.prototype.timeout = function(){  
    console.log('111', this.saver);
       
    if ( !this.saver ){
        this.callBack()
    }     
}     
ScreenSaver.prototype.signal = function(){     
        
    if ( !this.timerID ){     
        return;     
    }     
         
    window.clearTimeout(this.timerID);     
         
    var pThis = this;     
    var f = function(){pThis.timeout();}     
    this.timerID = window.setTimeout(f, this.nTimeout);     
}     
    
ScreenSaver.prototype.onevent = function(e){     
    this.screenSaver.signal();     
}

ScreenSaver.prototype.destroy = function(e){  
    
    console.log('destroy', this.timerID);
    if (this.timerID) {
        window.clearTimeout(this.timerID);
        this.timerID = null
    }    
}     

export default ScreenSaver