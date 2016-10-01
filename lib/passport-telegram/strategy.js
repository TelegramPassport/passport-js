/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Telegram authentication strategy authenticates requests by
 * delegating to unofficial telepass.me bridge using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your telepass.me application's App ID
 *   - `clientSecret`  your telepass.me application's App Secret
 *   - `callbackURL`   URL to which telepass.me will redirect the user after granting authorization
 *
 * Example (for more detailed example see the example folder):
 *
 *   passport.use(
 *       new TelegramStrategy({
 *           clientID: '123-456-789',
 *           clientSecret: 'shhh-its-a-secret'
 *           callbackURL: 'https://www.example.net/auth/telegram/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *           User.findOrCreate(..., function (err, user) {
 *               done(err, user);
 *           });
 *       }
 *   ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://telepass.me/oauth/authorize';
    options.tokenURL = options.tokenURL || 'https://telepass.me/oauth/token';
    options.scope = options.scope || ['basic', 'avatar'];

    OAuth2Strategy.call(this, options, verify);
    this.name = 'telegram';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user's Telegram profile info.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `telegram`
 *   - `id`               unique identifier for this user.
 *   - `first_name`       user's first name
 *   - `last_name`        user's last name
 *   - `username`         the user's Telegram username
 *   - `avatar`           URL to user's avatar
 *
 * @param {String} accessToken
 * @param {Function} done
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    var url = 'https://telepass.me/api/user';

    // Use the headers instead of the GET param:
    this._oauth2.useAuthorizationHeaderforGET(true);

    // Perform the request:
    this._oauth2.get(url, accessToken, function (err, body, res) {
        if (err) return done(new InternalOAuthError('failed to fetch user profile', err));

        try {
            var json = JSON.parse(body);

            var profile = {
                provider: 'telegram',
                id: json.id,
                first_name: json.first_name,
                last_name: json.last_name,
                username: json.username,
                avatar: null
            };

            // Avatar has to be requested with the distincted scope:
            if (json.avatar) {
                profile.avatar = json.avatar;
            };

            profile._raw = body;
            profile._json = json;

            done(null, profile);
        } catch(e) {
            done(e);
        };
    });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
