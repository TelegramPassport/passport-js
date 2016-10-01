var vows = require('vows');
var assert = require('assert');
var util = require('util');
var telegram = require('passport-telegram');


vows.describe('passport-telegram').addBatch({
    'module': {
        'should report a version': function (x) {
            assert.isString(telegram.version);
        }
    }
}).export(module);
