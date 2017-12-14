const pathFn = require('path')
const { watch } = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')

class SocketServer extends StaticServer {
  constructor(base, dir) {
    super(base, dir)
    this.listen = pathFn.join(base, dir.listen)
    this.clients = []
    this.server = null
    this.ws = null
    this.watcher = null
    this.callback = () => {}
  }

  set action(fn) {
    this.callback = fn
  }

  close() {
    this.watcher.close()
    this.ws.close()
    this.server.close()
  }

  start(port = '2222') {
    this.server = this.create(port)
    this.watcher = watch(this.listen, { ignored: /(^|[/\\])\../, ignoreInitial: true })
    this.ws = new Server({ server: this.server })

    this.ws.on('connection', (client) => {
      client.on('close', () => {
        this.clients = this.clients.filter(c => c !== client)
      })
      this.clients.push(client)
    })

    this.watcher.on('all', (e, path) => this.callback({ e, path, clients: this.clients }))

    // eslint-disable-next-line no-console
    console.log(`Server running: http://127.0.0.1:${port}/\nCTRL + C to shutdown`)
  }
}

module.exports = SocketServer
