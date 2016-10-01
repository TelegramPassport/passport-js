var express        = require('express');
var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var session        = require('express-session');
var passport       = require('passport');
var util           = require('util');

var decache = require('decache');
    decache('../lib/passport-telegram');
var TelegramStrategy = require('../lib/passport-telegram').Strategy;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete Telegram profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Get the App credentials from the environmental variables:
require('dotenv').config();


// Use the TelegramStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Telegram
//   profile), and invoke a callback with a user object.
passport.use(
    new TelegramStrategy({
        clientID: process.env.TELEPASS_APPID,
        clientSecret: process.env.TELEPASS_SECRET,
        callbackURL: 'http://127.0.0.1:3000/login/telegram/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Telegram profile is returned
            // to represent the logged-in user.  In a typical application, you would
            // want to associate the Telegram account with a user record in your
            // database, and return that user instead.
            return done(null, profile);
        });
    })
);


/**
 * Express demo-website.
 */

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));

// Initialize Passport! Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


// GET /
//   The index page will show either the login-with-telegram button, or display the
//   logged in user info.
app.get('/', function (req, res){
    res.render('index', { user: req.user, errors: false });
});

// GET /failed
//   Special page, used for failed authentication redirect URL.
app.get('/failed', function (req, res){
    res.render('index', { user: req.user, errors: true });
});

// GET /login/telegram
//   Use passport.authenticate() as route middleware to authenticate the request.
//   The first step in Telegram authentication will involve redirecting to the login page. 
//   After authorization, the user will be redirected back to this application at callback URL.
app.get('/login/telegram', passport.authenticate('telegram'), function (req, res) {
    // The request will be redirected to telepass.me for authentication, so this
    // function won't be called.
});

// GET /login/telegram/callback
//   Use passport.authenticate() as route middleware to authenticate the request. If
//   authentication fails, the user will be redirected to the special page. Otherwise,
//   the primary route function function will be called, which, in this example, will 
//   redirect the user to the index page.
app.get('/login/telegram/callback',
    passport.authenticate('telegram', { failureRedirect: '/failed' }),
    function (req, res) {
        res.redirect('/');
    }
);

// GET /logout
//   Logging out the user.
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    res.redirect('/login'); // <-- Attention: we don't have this page in the example.
};
