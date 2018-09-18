// Main modules
const express = require('express')
const fs = require('fs')
const http = require('http')

// Downloaded modules
const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server)
const Twig = require('twig')
const request = require('request')

// Global vars
const token = "changeme"
const lang = "fr"
const unit = "metric"

app.use(express.static(__dirname + "/public"))

app.set("twig options", {
    allow_sync: true, // Allow assynchronous compiling
    strict_variables: false
})

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.render('index.html.twig')
})

app.use((req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.render('error.html.twig')
})

server.listen(80, () => {
    // On starting web server
    console.log('OWM: Successfully loaded web server!')
})

io.on('connection', (socket) => {
    // On new connection
    socket.on('getWeatherWithCoords', (lat, lon) => {
        let url = `http://api.openweathermap.org/data/2.5/weather?appid=${token}&lat=${lat}&lon=${lon}&lang=${lang}&units=${unit}`
        request(url, (err, res, body) => {
            if (err) throw err
            let data = JSON.parse(body)
            socket.emit('sendWeatherInJSON', data)
        })
    })
})
