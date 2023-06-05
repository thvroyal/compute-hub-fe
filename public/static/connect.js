var seconds = 3
var restarting = false
var connectTimeout = null
var reporter = null
var processor = null

function protocol() {
    return 'protocol=websocket'
}

function restart() {
    if (restarting) return
    console.log('restart()')
    restarting = true
    if (processor) processor.close()
    processor = null
}

function start() {
    console.log('start()')
    processor = null
    // window.pando.config.secure = secure
    host = "localhost:" + window.pando.config.port
    setTimeout(function () {

        console.log('connecting over WebSocket')
        var protocol = false ? 'wss://' : 'ws://'
        window.pando.config.protocol = 'websocket'
        processor = volunteer['websocket'](protocol + host + '/volunteer', bundle)
        console.log(processor)
        // }
        processor.on('status', function (summary) {
            if (reporter) {
                console.log('reporting status')
                reporter.send(JSON.stringify(summary))
            }
        })
        processor.on('close', function () {
            restart()
            if (reporter) {
                console.log('reporting processor closed')
                reporter.send(JSON.stringify({ type: 'STATUS', closed: true }))
            }
        })
        processor.on('error', function (err) {
            restart()
            if (reporter) {
                console.log('reporting processor error')
                reporter.send(JSON.stringify({ type: 'STATUS', error: err }))
            }
        })
        processor.on('ready', function () {
            console.log('cleared restart timeout')
            clearTimeout(connectTimeout)
            restarting = false
        })

        // If connection does not succeed, keep retrying until it does
        console.log('setting restart timeout')
        connectTimeout = setTimeout(function () {
            console.log('connection timeout')
            if (reporter) {
                console.log('reporting connection timeout')
                reporter.send(JSON.stringify({ type: 'STATUS', error: 'Connection timeout, restarting' }))
            }
            restarting = false
            // restart()
        }, 30 * 1000)

        window.pando.processor = processor
    }, Math.floor(Math.random() * 1000)) // Random delay of up to 1s to avoid all nodes connecting at the same time
}
