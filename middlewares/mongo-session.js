var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

module.exports = function redis(settings) {
    settings.store = new MongoStore({
      mongooseConnection: mongoose.connection
    });
    return session(settings);
};