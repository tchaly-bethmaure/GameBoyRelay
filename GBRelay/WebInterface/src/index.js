import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.css';

import SocketIO from 'socket.io-client';
import { Serial } from './serial.js';
global.jQuery = require('jquery');
require('bootstrap');

const HOSTSTATIC = "127.0.0.1"; 

class OnlineGBGame extends React.Component {
  constructor(props)
  {
   super(props);
   console.log("Component init...");
   console.log("Set State to 0");
   this.state = 0;
   this.master = 1;
   this.gbdatain = "None";
   this.gbdataout = "None";
   console.log("Creating GBWebsocket ...");
   this.ws = new SocketIO.connect("https://"+HOSTSTATIC+":8080");
  }

  handleC() { // Handle create (master mode)
    console.log('Click create');
      console.log("Creating serial ...");
      this.serial = new Serial();
      console.log("Initializing websocket gymnastic ! (onmessage function)");
      console.log("Getting device ...");
      this.serial.getDevice().then(() => {
        this.state = 1;
        console.log("Usb connected, updating status.");
        this.connectionMaster();
      }).catch(c => {
        console.log("CATTTCH "+c);
      });
  }
  
  handleJ() { // Handle Join (master mode off)
   console.log('Click create');
      console.log("Creating serial ...");
      this.serial = new Serial();
      console.log("Initializing websocket gymnastic ! (onmessage function)");
      console.log("Getting device ...");
      this.serial.getDevice().then(() => {
        this.state = 1;
        console.log("Usb connected, updating status.");
        this.master = 0;
	this.connectionNotMaster();
      }).catch(c => {
        console.log("CATTTCH "+c);
      });
  }

  connectionNotMaster()
  {
   	let counter = 0;
        console.log("Wait for receiving first message ...");
        this.setState({
                state: 1
        });
        this.ws.on("message", (msg, serverOffset) => {
                console.log("Got message "+msg+" from "+serverOffset);
                this.gbdatain = msg;
                this.setState({
                        gbdatain: msg
                });
                console.log("Communicating to my GB ...");
                this.serial.sendHex(this.gbdatain);
                this.ws.auth.serverOffset = serverOffset;
                var clientOffset = this.ws.id+"-"+(counter++);
                this.gbdataout = this.serial.readHex();
                this.setState({
                        gbdataout: this.gbdataout
                });
                console.log("Sending to other GB "+this.gbdataout+" from my GB...");
                this.ws.emit('message', { text:JSON.parse(this.gbdataout), name: 'GB'+this.ws.id, id: this.ws.id+""+Math.random(), socketID: this.ws.id});
                console.log("Exchange "+counter+" : OK.");
        });
  }

  connectionMaster() {
	let counter = 0;
	console.log("Initiatting my first message ...");
	var clientOffset = this.ws.id+"-"+(counter++);
        this.gbdataout = this.serial.readHex();
	this.setState({
		gbdataout: this.gbdataout,
		state: 1
	});
	console.log("Sending to other GB "+this.gbdataout+" from my GB...");
	this.ws.emit('message', { text:JSON.parse(this.gbdataout), name: 'GB'+this.ws.id, id: this.ws.id+""+Math.random(), socketID: this.ws.id});
        console.log("First Exchange : OK.");
	this.ws.on("message", (msg, serverOffset) => {
		console.log("Got message "+msg+" from "+serverOffset);
		this.gbdatain = msg;
		this.setState({
			gbdatain: msg
		});
		console.log("Communicating to my GB ...");
		this.serial.sendHex(this.gbdatain);
		this.ws.auth.serverOffset = serverOffset;
		var clientOffset = this.ws.id+"-"+(counter++);
		this.gbdataout = this.serial.readHex();
		this.setState({
			gbdataout: this.gbdataout
		});
		console.log("Sending to other GB "+this.gbdataout+" from my GB...");
		this.ws.emit('message', { text:JSON.parse(this.gbdataout), name: 'GB'+this.ws.id, id: this.ws.id+""+Math.random(), socketID: this.ws.id});
		console.log("Exchange "+counter+" : OK.");
	});
  }
  
  render() {
	if(this.state === 0)
               return (
          	<div className="connect">
            		<button onClick={(e) => this.handleC()} className="btn btn-lg btn-secondary">Host (Master)</button><br/>
            		<button onClick={(e) => this.handleJ()} className="btn btn-lg btn-secondary">Connect (Client)</button>
          	</div>
               )
       else if(this.state === 1)
		return (
                <div className="connect">
	                <h4>Connected => IN { this.gbdatain.toString() } OUT { this.gbdataout.toString() }</h4>
                </div>
               )
   }
}

// ========================================

ReactDOM.render(
  <OnlineGBGame />,
  document.getElementById('root')
);
