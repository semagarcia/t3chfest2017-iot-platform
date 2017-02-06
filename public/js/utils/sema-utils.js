window.semaUtils = (function () {
     
    var utils = {};

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
    utils.requestSensorState = (sensor, callback) => {
        $.ajax({
            url: '/sensor/' + sensor,
            success: function(data) {
                callback(data);
            },
            cache: false
        });
    };

    /**
     * 
     */
    utils.requestSensorData = (endpoint, chart, callback) => {
        utils.log('Calling to ', endpoint);

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
    utils.sendX10Command = () => {
        $.ajax({
            type: 'post',
            url: 'http://192.168.12.70:3000/x10',
            data: { a:1, b:'on' },
            success: function(data) {
                console.log('>> ', data);
            },
            cache: false
        });
    };

    /**
     * 
     */
    utils.getSongList = (callback) => {
        $.ajax({
            url: 'http://192.168.12.70:3000/library',
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
            url: 'http://192.168.12.70:3000/library/play',
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
            url: 'http://192.168.12.70:3000/library/stop',
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
            url: 'http://192.168.12.70:3000/library/forward',
            success: function(data) {
            },
            cache: false
        });
    };

    return utils;
}($));