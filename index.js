const { watch } = require('chokidar')
const { Server } = require('ws')
const Logger = require('acyort-logger')
const StaticServer = require('./lib/server')

class SocketServer extends StaticServer {
  constructor({ watches, publics }) {
    super(publics)
    this.watches = watches
    this.logger = new Logger()
    this.initialize()
  }

  initialize() {
    this.timer = null
    this.clients = []
    this.server = null
    this.ws = null
    this.watcher = null
    this.callback = () => null
    this.current = null
  }

  set trigger(fn) {
    if (typeof fn === 'function') {
      this.callback = fn
    }
  }

  get status() {
    return this.current
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

  get running() {
    return !!this.server
  }

  start(port = '2222') {
    if (this.running) {
      return this.logger.info('The server is running...')
    }

    this.watcher = watch(this.watches, { ignored: /(^|[/\\])\../, ignoreInitial: true })
    this.watcher.on('all', (e, path) => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.current = { e, path }
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

    return this.logger.info(`Server running: http://127.0.0.1:${port}/\n  CTRL + C to shutdown`)
  }
}

module.exports = SocketServer
