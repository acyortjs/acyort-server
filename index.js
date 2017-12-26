const pathFn = require('path')
const { watch } = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')

class SocketServer extends StaticServer {
  constructor(base, dir) {
    super(base, dir)
    this.listen = pathFn.join(base, dir.listen)
    this.timer = null
    this.clients = []
    this.server = null
    this.ws = null
    this.watcher = null
    this.listeners = []
  }

  addListener(fn) {
    if (typeof fn === 'function') {
      this.listeners.push(fn)
    }
  }

  removeListeners() {
    this.listeners = []
  }

  close() {
    this.watcher.close()
    this.ws.close()
    this.server.close()
  }

  removeClient(client) {
    this.clients = this.clients.filter(c => c !== client)
  }

  start(port = '2222') {
    if (this.server) {
      // eslint-disable-next-line no-console
      return console.log('The server is running...')
    }

    this.server = this.create(port)
    this.watcher = watch(this.listen, { ignored: /(^|[/\\])\../, ignoreInitial: true })
    this.ws = new Server({ server: this.server })

    this.ws.on('connection', (client) => {
      client.on('close', () => this.removeClient(client))
      client.on('error', () => this.removeClient(client))
      this.clients.push(client)
    })

    this.watcher.on('all', (e, path) => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.listeners.forEach(fn => fn({ e, path, clients: this.clients }))
      })
    })

    // eslint-disable-next-line no-console
    return console.log(`Server running: http://127.0.0.1:${port}/\nCTRL + C to shutdown`)
  }
}

module.exports = SocketServer
