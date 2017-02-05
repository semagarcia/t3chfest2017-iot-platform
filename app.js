var express = require('express');
var app = express();
var cors = require('cors');
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));  
app.use('/js', express.static(__dirname + '/public')); 
app.use('/css', express.static(__dirname + '/public')); 

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get('/', (req, res) => {
  res.sendFile('public/index.html');
});

app.get('/temp', (req, res) => {
  var data = [],
      time = (new Date()).getTime(),
      i;

  for (i=0; i<20; i++) {
    data.push({
        x: time + i * 1000,
        y: getRandomValue(40, 0) 
    });
  }

  res.send({
    sensor: 'temperature',
    lastValues: data
  });
});

app.get('/gas', (req, res) => {
  var data = [],
      randomValues = [1, 2, 3, 4, 5, 6],
      time = (new Date()).getTime(),
      i;

  for (i=0; i<20; i++) {
    data.push({
        x: time + i * 1000,
        y: randomValues[getRandomValue(5, 0)]
    });
  }

  res.send({
    sensor: 'gas',
    lastValues: data
  });
});

app.get('/light', (req, res) => {
  var data = [],
      time = (new Date()).getTime(),
      i;

  for (i=0; i<20; i++) {
    data.push({
        x: time + i * 1000,
        y: getRandomValue(40, 0) 
    });
  }

  res.send({
    sensor: 'light',
    lastValues: data
  });
});

/**
 * 
 */
io.set('origins', '*:*');

/**
 * 
 */
io.on('connection', (clientSocket) => {  
    console.log('Client connected... ' + clientSocket.id);

    clientSocket.on('event:cient', (message) => {
      console.log('Message received: ', message);
      clientSocket.emit('msg', { resp: 'user logged successfully' });
    });
});

/**
 * La que envía el dato actualizado
 */
setInterval(function(){
  let now = new Date().getTime();
  io.sockets.emit('sensors:values', { 
    temperature: {
      timestamp: now, 
      value: getRandomValue(40, 0) 
    },
    gas: {
      timestamp: now, 
      value: getRandomValue(5, 0)
    },
    light: {
      timestamp: now, 
      value: getRandomValue(40, 0)
    }
  });
}, 1000); // Parametrizar este valor

function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
