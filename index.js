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
        });
        callback.apply(this, arguments);
      });
    });
  };
};
