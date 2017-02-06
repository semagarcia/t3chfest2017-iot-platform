var express = require('express');
var app = express();
var cors = require('cors');
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
//var settings = require('./settings.json');

var mraa = require('mraa');
var sensors = require('jsupm_grove');
var tempSensor = new sensors.GroveTemp(0);
var lightSensor = new sensors.GroveLight(1);
var rotarySensor = new sensors.GroveRotary(2);
var GAS_THRESHOLD = 400;
var gasSensorLibrary = require('jsupm_gas');
var gasSensor = new gasSensorLibrary.MQ5(3);
var buzzer = new mraa.Gpio(5);
buzzer.dir(mraa.DIR_OUT);
var buzzerState = 0;
var panicMode = false;
var intervalPanicMode;
var led = new sensors.GroveLed(3);
var ledState = 'off';
var touchSensor = new mraa.Gpio(6);
touchSensor.dir(mraa.DIR_IN);

// Initialize sensors
buzzer.write(0);
led.off();


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

app.get('/settings', (req, res) => {
  res.send([
    { key: 'frequency', name: 'Sampling frequency', value: 'xxx' },
    { key: 'numberOfPoints', name: 'Number of points', value: 'yyy' },
    { key: 'k1', name: 'n1', value: 'v1' },
    { key: 'k2', name: 'n2', value: 'v2' }
  ]);
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

app.get('/sensor/led', (req, res) => {
  res.send({
    sensor: 'led',
    state: ledState
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

    clientSocket.on('event:client', (message) => {
      console.log('Message received: ', message);
      clientSocket.emit('msg', { resp: 'user logged successfully' });
    });

    clientSocket.on('event:sensor', (actionData) => {
      console.log('Registered action: ', JSON.stringify(actionData));
      switch(actionData.sensor) {
        case 'switcher':
          if(actionData.action === 'on') {
            led.on();
            ledState = 'on';
            io.sockets.emit('event:sensor', { 
              sensor: 'switcher',
              value: ledState
            });
          } else {
            led.off();
            ledState = 'off';
            io.sockets.emit('event:sensor', { 
              sensor: 'switcher',
              value: ledState
            });
          }
          break;
      }
    });
});

/**
 * La que envía el dato actualizado
 */
setInterval(function(){
  var now = new Date().getTime();
  console.log(`>> T: ${tempSensor.value()}ºC, L: ${lightSensor.value()}LUX, R: ${rotarySensor.abs_value()}º, G: ${gasSensor.getSample()}, T2: ${touchSensor.read()}`);

  if(gasSensor.getSample() > GAS_THRESHOLD && !panicMode) {
    panicMode = true;
    intervalPanicMode = setInterval(() => {
      console.log(' >>>> PANIC MODE ENABLED!!!! <<<<');
      buzzer.write(buzzerState);
      buzzerState = (buzzerState === 0) ? 1 : 0;
    }, 200);
  } else if(gasSensor.getSample() <= GAS_THRESHOLD && panicMode) {
    clearInterval(intervalPanicMode);
    panicMode = false;
    buzzer.write(0);
    console.log('>> Disabling panic mode... all it is OK now!');
  }

  io.sockets.emit('sensors:values', { 
    timestamp: now,
    temperature: {
      value: tempSensor.value()
    },
    gas: {
      panicMode: panicMode,
      value: gasSensor.getSample()
    },
    light: {
      value: lightSensor.value()
    },
    rotary: {
      value: {
        abs: rotarySensor.abs_value(),
        rel: rotarySensor.rel_value()
      }
    },
    touch: {
      state: touchSensor.read()
    }
  });
}, 1000); // Parametrizar este valor

function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
