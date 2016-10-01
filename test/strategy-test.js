var vows = require('vows');
var assert = require('assert');
var util = require('util');
var TelegramStrategy = require('passport-telegram/strategy');


vows.describe('TelegramStrategy').addBatch({

    'strategy': {
        topic: function() {
            return new TelegramStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret'
            },
            function() {});
        },

        'should be named telegram': function (strategy) {
            assert.equal(strategy.name, 'telegram');
        },
    },

    'strategy when loading user profile': {
        topic: function() {
            var strategy = new TelegramStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret'
            },
            function() {});

            // mock
            strategy._oauth2.get = function(url, accessToken, callback) {
                if (url === 'https://telepass.me/api/user') {
                    var body = '{' +
                        '"id": 123456789,' +
                        '"first_name": "FirstName",' +
                        '"last_name": "LastName",' +
                        '"username": "TestUsername",' +
                        '"avatar": "https://www.example.com/image.jpg"' +
                    '}';
                    callback(null, body, undefined);
                } else {
                    callback(new Error('invalid user profile URL'));
                };
            };

            return strategy;
        },

        'when told to load user profile': {
            topic: function(strategy) {
                var self = this;
                function done(err, profile) {
                    self.callback(err, profile);
                };

                process.nextTick(function () {
                    strategy.userProfile('access-token', done);
                });
            },

            'should not error': function(err, req) {
                assert.isNull(err);
            },
            'should load profile': function(err, profile) {
                assert.equal(profile.provider, 'telegram');
                assert.equal(profile.id, 123456789);
                assert.equal(profile.first_name, 'FirstName');
                assert.equal(profile.last_name, 'LastName');
                assert.equal(profile.username, 'TestUsername');
                assert.equal(profile.avatar, 'https://www.example.com/image.jpg');
            },
            'should set raw property': function(err, profile) {
                assert.isString(profile._raw);
            },
            'should set json property': function(err, profile) {
                assert.isObject(profile._json);
            },
        },
    },

    'strategy when loading user profile and encountering an error': {
        topic: function() {
            var strategy = new TelegramStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret'
            },
            function() {});

            // mock
            strategy._oauth2.get = function(url, accessToken, callback) {
                callback(new Error('something-went-wrong'));
            };

            return strategy;
        },

        'when told to load user profile': {
            topic: function(strategy) {
                var self = this;
                function done(err, profile) {
                    self.callback(err, profile);
                };

                process.nextTick(function () {
                    strategy.userProfile('access-token', done);
                });
            },

            'should error' : function(err, req) {
                assert.isNotNull(err);
            },
            'should wrap error in InternalOAuthError' : function(err, req) {
                assert.equal(err.constructor.name, 'InternalOAuthError');
            },
            'should not load profile' : function(err, profile) {
                assert.isUndefined(profile);
            },
        },
    },

}).export(module);
