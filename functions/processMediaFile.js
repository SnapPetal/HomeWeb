const creds = require('../lib/credentials.js')()
var util = require('util')
var OAuth = require('oauth')
var oauth = new OAuth.OAuth(
  'http://api.smugmug.com/services/oauth/1.0a/getRequestToken',
  'http://api.smugmug.com/services/oauth/1.0a/getAccessToken',
  creds.app_key,
  creds.app_secret,
  '1.0A',
  'oob',
  'HMAC-SHA1'
)

oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
  if (error) console.log('error :', error)
  else {
    console.log('oauth_token :' + oauth_token)
    console.log('oauth_token_secret :' + oauth_token_secret)
    console.log('requestoken results :' + util.inspect(results))
    console.log('Requesting access token')

    oauth.get(
      'http://www.api.smugmug.com/api/v2/user/thomaswhite',
      oauth_token,
      oauth_token_secret,
      function (error, data, response) {
        if (error) console.error(error)
        console.log('data', data)
        console.log(response)
      }
    )
  }
})

exports.handler = async function(event:any) {
    console.log(event);
}