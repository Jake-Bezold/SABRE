/*
    Developer: Warren Seto
    Project  : R1 Base Station Mini-Server Routing
*/

"use strict"


const socket = require('socket.io-client').connect('https://sabretcnj.herokuapp.com', {
    reconnect: true,
    query: 'auth=' + 'https://sabretcnj.herokuapp.com' + '&name=' + 'https://sabretcnj.herokuapp.com'.name
})

socket.on('connect', function () {
    console.log('Connected!')
})

socket.on('disconnect', function () {
    console.log('DisConnected...')
})

const SerialPort = require('serialport'),
    port = new SerialPort('https://sabretcnj.herokuapp.com'.usb.port, {
        baudRate: 'https://sabretcnj.herokuapp.com'.usb.rate
    })

port.on('data', function (data) {
    socket.emit('payload', {
        'data': data.toString('ascii')
    })
})

port.on('error', function (err) {
    console.log('Error: ', err.message)
})

process.stdin.resume() //so the program will not close instantly

function exitHandler(options, err) {

    port.close(function (err) {
        console.log('port closed', err)
    })

    if (err) console.log(err.stack)
    if (options.exit) process.exit()
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}))
 
