var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));  
app.use('/js', express.static(__dirname + '/public')); 
app.use('/css', express.static(__dirname + '/public')); 
//app.use(express.static('public'));  
//app.use(express.static('app/dist'));  
//app.use('/static', express.static('public'));
//app.use('/static', express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  console.log('Serving index.html');
  res.sendFile('public/index.html');
  //res.sendFile('app/dist/index.html');
});

io.on('connection', (clientSocket) => {  
    console.log('Client connected... ' + clientSocket.id);

    clientSocket.on('event:cient', (message) => {
      console.log('Message received: ', message);
      clientSocket.emit('msg', { resp: 'user logged successfully' });
    });
});

setInterval(function(){
  //clientSocket.emit('msg', { resp: new Date(), value: getRandomValue(10, 1) });
  io.sockets.emit('msg', { resp: new Date(), value: getRandomValue(40, 0) });
}, 5000);

function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
