const request = require('request')

if ( process.env.NODE_ENV === 'production') {
    var MAPBOX_TOKEN = process.env.MAPBOX_TOKEN
    var DARK_SKY_SECRET_KEY = process.env.DARK_SKY_SECRET_KEY
} else {
    const credentials = require('./credentials.js')
    var MAPBOX_TOKEN = credentials.MAPBOX_TOKEN
    var DARK_SKY_SECRET_KEY = credentials.DARK_SKY_SECRET_KEY
}

const geocode = function(city, callback) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + city + '.json?access_token=' + MAPBOX_TOKEN

    request({ url, json: true }, function(error, response) {
        if (error) {
            callback (error, undefined)
        } else {
            const data = response.body

            if ( data.features === undefined || data.features.length == 0) {
                callback ('Error: ' + data.message, undefined)
            } else {
                const info = {
                    coordinates: data.features[0].center,
                    city: city
                }

                callback (undefined, info)
            }
        }
    })
}

const darksky = function(info, callback) {
    const url = 'https://api.darksky.net/forecast/' + DARK_SKY_SECRET_KEY + 
        '/' + info.coordinates[1] + ',' + info.coordinates[0] + '?units=si'

    request({ url, json: true }, function(error, response) {
        if (error) {
            callback ('Error: ' + error.Error, undefined)
        } else {
            const data = response.body

            if ( data.error !== undefined ) {
                callback ('Error: ' + data.error, undefined)
            } else {
                const phrase = 'The weather in ' + info.city + ':\n' +
                    '\tIt currently is ' + data.currently.summary + ' with a temperature of ' + data.currently.temperature + '°C. ' +
                    'Precipitation probability is of ' + data.currently.precipProbability + '%.\n' +
                    '\tFor the rest of the day, ' + data.hourly.summary + '\n' +
                    '\tAnd for the rest of the week, ' + data.daily.summary + '\n'

                callback (undefined, phrase)
            }
        }
    })
}

module.exports = {
    geocode: geocode,
    darksky: darksky
}