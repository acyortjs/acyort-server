const pathFn = require('path')
const { watch } = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')

class SocketServer extends StaticServer {
  constructor(base, dir) {
    super(base, dir)
    this.listen = pathFn.join(base, dir.listen)
    this.clients = []
    this.callback = () => {}
  }

  set action(fn) {
    this.callback = fn
  }

  start(port) {
    this.callback({ msg: 'Starting...' })

    const server = this.create(port)
    const watcher = watch(this.listen, { ignored: /(^|[/\\])\../, ignoreInitial: true })
    const ws = new Server({ server })

    ws.on('connection', (client) => {
      client.on('close', () => {
        this.clients = this.clients.filter(c => c !== client)
      })
      this.clients.push(client)
    })

    watcher.on('all', (e, path) => this.callback({ e, path, clients: this.clients }))

    this.callback({ msg: `Server running\n=> http://127.0.0.1:${port}/\nCTRL + C to shutdown` })
  }
}

module.exports = SocketServer
