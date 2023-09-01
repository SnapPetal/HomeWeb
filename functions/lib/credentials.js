module.exports = function (extra) {
    'use strict'
  
    let credentials = {
      username: process.env.smugmug_username,
      app_key: process.env.smugmug_app_key,
      app_secret: process.env.smugmug_app_secret
    }
  
    credentials = Object.assign({}, credentials, extra)
  
    if (!credentials.username) {
      throw new Error('Missing smugmug username')
    }
    return credentials
  }