'use strict';

var sapi = require('../controllers/sapi');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Sapi, app, auth, database) {

    app.route('/api/sapi/:name/:id?')
        .put(auth.requiresLogin, auth.requiresToken, sapi.update);

    app.route('/api/sapi/*')
        .post(auth.requiresLogin, auth.requiresToken, sapi.post);

    app.route('/api/sapi/*')
        .get(auth.requiresLogin, auth.requiresToken, sapi.get);

    app.route('/api/sapi/*')
        .delete(auth.requiresLogin, auth.requiresToken, sapi.delete);

    app.route('/api/app/:id')
        .get(auth.requiresLogin, auth.requiresToken, sapi.get);

    app.route('/api/appsun/aggs/:name/:id/:index/:type?')
        .get(auth.requiresLogin, auth.requiresToken, sapi.get);

    app.route('/api/appsun/search/:id/:index/:type?')
        .get(auth.requiresLogin, auth.requiresToken, sapi.get);

    app.route('/api/appsun/:name/:index/:type?')
        .get(auth.requiresLogin, auth.requiresToken, sapi.get);

};
