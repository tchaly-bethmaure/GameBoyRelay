class GBWebsocket {
    constructor(url)
    {
        this.ws = new WebSocket(url);
    }
    
    init(s)
    {
     this.serial = s;
     this.ws.onmessage = (function(event){
          console.log("Receiving message from other GameBoy !");
          // We receive something, we register it to a buffer
	  this.serial.receiveFromOtherGB(event.data);
          
          console.log("Send it to my GB !!");
	  // Then we send it by serial to my GB
          this.serial.sendToMyGB();
          
          console.log("Waiting for GB response !!!");
          // Waiting for my GB Response
          this.serial.receiveFromMyGB();
	  
          console.log("Send response to other GB !!!!");
          if(this.serial.buffer_out.length > 0)
               this.ws.send(this.serial.buffer_out.pop());
     }).bind(this);
     this.waitForConnection();
    }

    waitForConnection() 
    {
        if(this.ws.readyState === 1)
        {
            console.log("Connection ready");
            
        } else 
        {
            setTimeout(
                this.waitForConnection.bind(this),
                100
            )
        }
    }

    send(data)
    {
        this.ws.send(data);        
    }

    read()
    {
        return this.ws.read();
    }


}

export { GBWebsocket };
