'use strict';

var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LinkedinStrategy = require('passport-linkedin').Strategy,
    User = mongoose.model('User'),
    config = require('meanio').loadConfig(),
    request = require('request');

module.exports = function(passport) {
    // Serialize the user id to push into the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // Deserialize the user object based on a pre-serialized token
    // which is the user id
    passport.deserializeUser(function(user, done) {
        done(null, user);
        // User.findOne({
        //     _id: user._id
        // }).exec(function(err, user1) {
        //     done(err, user1);

        // });
    });

    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            var options = {
                uri: config.stsApi.uri + '/user/login',
                form: {
                    'email': email,
                    'password': password
                }
            };
            request.post(options, function(error, response, body) {
                if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
                    body = JSON.parse(body);
                    if (body.roles.indexOf('admin') === -1) return done(null, false, {
                        message: 'Permission denied'
                    });
                    done(null, body);
                } else {
                    console.log('login error', error);
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
            });
        }));

    // Use twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: config.strategies.twitter.clientID,
            consumerSecret: config.strategies.twitter.clientSecret,
            callbackURL: config.strategies.twitter.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({
                'twitter.id_str': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(err, user);
                }
                user = new User({
                    name: profile.displayName,
                    username: profile.username,
                    provider: 'twitter',
                    twitter: profile._json,
                    roles: ['authenticated']
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        return done(null, false, {
                            message: 'Twitter login failed, email already used by other login strategy'
                        });
                    } else {
                        return done(err, user);
                    }
                });
            });
        }
    ));

    // Use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.strategies.facebook.clientID,
            clientSecret: config.strategies.facebook.clientSecret,
            callbackURL: config.strategies.facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'facebook.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(err, user);
                }
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username || profile.emails[0].value.split('@')[0],
                    provider: 'facebook',
                    facebook: profile._json,
                    roles: ['authenticated']
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        return done(null, false, {
                            message: 'Facebook login failed, email already used by other login strategy'
                        });
                    } else {
                        return done(err, user);
                    }
                });
            });
        }
    ));

    // Use github strategy
    passport.use(new GitHubStrategy({
            clientID: config.strategies.github.clientID,
            clientSecret: config.strategies.github.clientSecret,
            callbackURL: config.strategies.github.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'github.id': profile.id
            }, function(err, user) {
                if (user) {
                    return done(err, user);
                }
                user = new User({
                    name: profile._json.displayName || profile._json.login,
                    username: profile._json.login,
                    email: profile.emails[0].value,
                    provider: 'github',
                    github: profile._json,
                    roles: ['authenticated']
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        return done(null, false, {
                            message: 'Github login failed, email already used by other login strategy'
                        });
                    } else {
                        return done(err, user);
                    }
                });
            });
        }
    ));

    // Use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.strategies.google.clientID,
            clientSecret: config.strategies.google.clientSecret,
            callbackURL: config.strategies.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (user) {
                    return done(err, user);
                }
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.emails[0].value,
                    provider: 'google',
                    google: profile._json,
                    roles: ['authenticated']
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        return done(null, false, {
                            message: 'Google login failed, email already used by other login strategy'
                        });
                    } else {
                        return done(err, user);
                    }
                });
            });
        }
    ));

    // use linkedin strategy
    passport.use(new LinkedinStrategy({
            consumerKey: config.strategies.linkedin.clientID,
            consumerSecret: config.strategies.linkedin.clientSecret,
            callbackURL: config.strategies.linkedin.callbackURL,
            profileFields: ['id', 'first-name', 'last-name', 'email-address']
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'linkedin.id': profile.id
            }, function(err, user) {
                if (user) {
                    return done(err, user);
                }
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.emails[0].value,
                    provider: 'linkedin',
                    linkedin: profile._json,
                    roles: ['authenticated']
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        return done(null, false, {
                            message: 'LinkedIn login failed, email already used by other login strategy'
                        });
                    } else {
                        return done(err, user);
                    }
                });
            });
        }
    ));
    return passport;
};
