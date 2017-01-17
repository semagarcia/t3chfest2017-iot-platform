var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static('public'));  
// app.use('/static', express.static('public'));
// app.use('/static', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  console.log('Serving index.html');
  res.sendFile('public/index.html');
});

io.on('connection', (clientSocket) => {  
    console.log('Client connected...');
    clientSocket.on('join', (data) => {
        console.log(data);
    });

    clientSocket.on('msg', (message) => {
      console.log('Message received: ', message);
      io.emit('msg', { resp: message.data + 1 });
    });
});

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
