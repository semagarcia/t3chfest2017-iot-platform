window.semaUtils = (function () {
     
    var utils = {};

    /**
     * 
     */
    utils.serverMediaIP = '192.168.1.3:3000';

    /**
     * 
     */
    utils.log = (traceMessage, level) => {
        if(window.semaDebugMode) {
            switch(level) {
                case 'error':
                    console.error('[SIP] ' + traceMessage);
                    break;
                case 'info':
                    console.info('[SIP] ' + traceMessage);
                    break;
                case 'warn':
                    console.warn('[SIP] ' + traceMessage);
                    break;
                default:
                    console.log('[SIP] ' + traceMessage);
            }
        }
    };

    /**
     * 
     */
    utils.getSettings = (callback) => {
        $.ajax({
            url: '/settings',
            success: function(data) {
                callback(data);
            },
            cache: false
        });
    };

    /**
     * (Implementation through a promise instead of callbacks)
     */
    utils.requestSensorState = (sensor) => {
        var promise = new Promise((resolve, reject) => {
            $.ajax({
                url: '/sensor/' + sensor,
                success: (data) => {
                    resolve(data);
                },
                error: (err) => {
                    reject(err);
                },
                cache: false
            });
        });
        return promise;
    };

    /**
     * 
     */
    utils.requestSensorData = (endpoint, chart, callback) => {
        utils.log('Calling to ' + endpoint);

        // "Sanitize" the input
        if(endpoint.charAt(0) === '/') {
            endpoint = endpoint.slice(1);
        }

        $.ajax({
            url: endpoint,
            success: function(data) {
                var series = chart.series[0],
                    shift = series.data.length > 20;

                // add the points
                for(let i=0; i<data.lastValues.length; i++) {
                    chart.series[0].addPoint(data.lastValues[i], true, shift);
                }

                callback();
            },
            cache: false
        });
    }; 

    /**
     * 
     */
    utils.sendX10Command = (device, action, callback) => {
        $.ajax({
            type: 'post',
            url: `${utils.serverMediaIP}/x10`,
            data: { 
                device: device, 
                action: action 
            },
            success: function() {
                callback();
            },
            cache: false
        });
    };

    /**
     * 
     */
    utils.getSongList = (callback) => {
        $.ajax({
            url: `${utils.serverMediaIP}/library`,
            success: function(data) {
                callback(data);
            },
            cache: false
        });
    };

    /**
     * 
     */
    utils.playSong = (song) => {
        $.ajax({
            type: 'post',
            data: { song: song },
            url: `${utils.serverMediaIP}/library/play`,
            success: function() { },
            error: function() { 
                // Check if there was an error (erro handler)
            },
            cache: false
        });
    };

    /**
     * 
     */
    utils.stopPlaying = () => {
        $.ajax({
            url: `${utils.serverMediaIP}/library/stop`,
            success: function(data) {
            },
            cache: false
        });
    };

    /**
     * 
     */
    utils.forwardPlaying = () => {
        $.ajax({
            url: `${utils.serverMediaIP}/library/forward`,
            success: function(data) {
            },
            cache: false
        });
    };

    /**
     * 
     */
    utils.connectToBulb = () => {
        if(navigator.bluetooth) {
            navigator.bluetooth.requestDevice({
                filters: [{ services: [0xffe5] }]
            })
            .then(function(device) {
                // Step 2: Connect to it
                console.log('setp2: ', device);
                return device.gatt.connect();
            })
            .then(function(server) {
                // Step 3: Get the Service
                console.log('setp3: ', server);
                return server.getPrimaryService(0xffe5);
            })
            .then(function(service) {
                // Step 4: get the Characteristic
                console.log('setp4: ', service);
                return service.getCharacteristic(0xffe9);
            })
            .then(function(characteristic) {
                // Step 5: Write to the characteristic
                console.log('setp5: ', characteristic);
                utils.ledCharacteristic = characteristic;
                var data = new Uint8Array([0xbb, 0x25, 0x05, 0x44]);
                return characteristic.writeValue(data);
            })
            .catch(function(error) {
                // And of course: error handling!
                console.error('Connection failed! ', error);
            });
        } else {
            alert('Error, bluetooth not supported or disconnected');
        }
    };

    /**
     * 
     */
    utils.setBulbColor = (r, g, b) => {
        if(utils.ledCharacteristic) {
            let data = new Uint8Array([0x56, r, g, b, 0x00, 0xf0, 0xaa]);
            return utils.ledCharacteristic.writeValue(data)
                .catch(err => console.log('Error when writing value! ', err));
        }
    };

    return utils;
}($));