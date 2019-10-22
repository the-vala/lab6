const weather = require ('./weather.js')
const express = require ('express')

const app = express ()
const port = process.env.PORT || 3000

app.get ('/weather', function (req, res) {
    res.setHeader ('Acces-Control-Allow-Origin', '*')
    
	if (!req.query.search) {
		return res.send({
			error: 'Tienes que dar un objeto valido'
		})
    }
    
	weather.geocode (req.query.search, function (error, response) {
		if (error) {
			return res.send ({
				error: error
			})
        } else {
            weather.darksky (response, function (error, phrase) {
                if (error) {
                    return res.send ({
                        error: error
                    })
                } else {
                    return res.send(phrase)
                }
            })
        }
	})
})

app.get ('/', function (req, res) {
    res.send ('Bienvenido al lab 6!')
})

app.get ('*', function (req, res) {
    res.send( {
        error: 'Error 500: Esta ruta no existe'
    })
}) 

app.listen (port, function () {
    console.log ('Up and running')
})