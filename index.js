var Socket = require('socket.io/lib/socket');
var moment = require('moment');
var request = require('request');

module.exports = function (endpoint) {
  Socket.prototype.$on = require('events').EventEmitter.prototype.on;
  Socket.prototype.on = function (eventName, handler) {
    this.$on(eventName, function (data, callback) {
      var startTime = +moment.utc();
      handler(data, function () {
        var endTime = +moment.utc();
        var latency = endTime-startTime;

        request({
          uri: endpoint,
          method: 'POST',
          form: {latency: {event_name: eventName, value: latency}},
          json: true
        },
        function (error, response, body) {
          if (error) {
            console.log('Could not send latency to defined endpoint: ', error.code) // Print the google web page.
          }
        });
        callback.apply(this, arguments);
      });
    });
  };
};
