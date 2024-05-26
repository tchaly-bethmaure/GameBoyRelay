<h1>GameBoyRelay</h1>
A GameBoy Relay over Internet

<h3>What do you need</h3>
<b>hardware</b> :
<ul>
<li>one raspberry pico coupled with stacksmashing board,
<li>one link câble,</li>
<li>one cable to connect pico to PC.</li>
<li>one gameboy,</li>
</ul>


<b>software</b> :
<ul>
<li>gb firmware (act a relay from GB to PC), put the firmware in your pico</li>
<li>connect to the web interface (link given when tests will be OK)</li>
<li>select your gameboy with webusb</li>
<li>connect as Master or Client (wait for the other gameboy)</li>
<li>... enjoy :)</li>
</ul>

<br>

<h3>ReactJS project :</h3>
./WebInterface/<br>
npm install<br>
npm run build<br>
HTTPS=true npm start<br>

<br>
<br>

<h3>Python server :</h3>
./<br>
pip3 install (required dependancies)<br>
python3 server.py


<h4>P.S.</h4> Don't forget to change the IP/Ports used (wether it's local or only).
