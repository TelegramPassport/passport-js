# Passport-Telegram
[Passport](http://passportjs.org/) strategy for authenticating with [Telegram Messenger](https://telegram.org) using the unofficial OAuth 2.0 API.

> Note: this project is unofficial and is not affiliated with Telegram.

This module lets you authenticate using Telegram in your Node.js applications. By plugging into Passport, Telegram authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

## Installation
```
$ npm install passport-telegram
```

## Usage
#### Getting credentials
First of all you need to sign in to [telepass.me](https://telepass.me), register your application and obtain the `APP_ID` and `APP_SECRET`.

#### Configure Strategy

The Telegram authentication strategy authenticates requests by delegating to unofficial bridge using the OAuth 2.0 protocol.

Applications must supply a `verify` callback which accepts an `accessToken`, `refreshToken` and service-specific `profile`, and then calls the `done` callback supplying a `user`, which should be set to `false` if the credentials are not valid.  If an exception occured, `err` should be set.

Options:
 - `clientID`      your application's App ID
 - `clientSecret`  your application's App Secret
 - `callbackURL`   URL to which the user will be redirected after granting authorization
 
### Example
For more detailed example see the example folder.
```javascript
 passport.use(
    new TelegramStrategy({
        clientID: '123-456-789',
        clientSecret: 'shhh-its-a-secret'
        callbackURL: 'https://www.example.net/auth/telegram/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate(..., function (err, user) {
            done(err, user);
        });
    }
 ));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'telegram'` strategy to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/telegram', 
    passport.authenticate('telegram'),
    function(req, res) {
        // The request will be redirected to telepass.me for authentication,
        // so this function will not be called.
    }
);

app.get('/auth/telegram/callback', 
    passport.authenticate('telegram', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);
```

## Examples

For a complete, working example, refer to the [login example](https://github.com/TelegramPassport/passport-js/tree/master/example).

## Tests
```bash
$ npm install --dev
$ make test
```

## License

(The MIT License)

Copyright (c) 2016 Telegram Passport

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
