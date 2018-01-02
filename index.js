const { watch } = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')

class SocketServer extends StaticServer {
  constructor() {
    super()
    this.initialize()
  }

  initialize() {
    this.timer = null
    this.clients = []
    this.server = null
    this.ws = null
    this.watcher = null
    this.callback = () => {}
  }

  set trigger(fn) {
    if (typeof fn === 'function') {
      this.callback = fn
    }
  }

  close() {
    this.watcher.close()
    this.ws.close()
    this.server.close()
    this.initialize()
  }

  removeClient(client) {
    this.clients = this.clients.filter(c => c !== client)
  }

  start({ port = '2222', watches, publics }) {
    if (this.server) {
      // eslint-disable-next-line no-console
      return console.log('The server is running...')
    }

    this.public = publics

    this.watcher = watch(watches, { ignored: /(^|[/\\])\../, ignoreInitial: true })
    this.watcher.on('all', (e, path) => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.callback({ e, path, clients: this.clients })
      })
    })

    this.server = this.create(port)
    this.ws = new Server({ server: this.server })

    this.ws.on('connection', (client) => {
      client.on('close', () => this.removeClient(client))
      client.on('error', () => this.removeClient(client))
      this.clients.push(client)
    })

    // eslint-disable-next-line no-console
    return console.log(`Server running: http://127.0.0.1:${port}/\nCTRL + C to shutdown`)
  }
}

module.exports = SocketServer
