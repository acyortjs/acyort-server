const pathFn = require('path')
const { watch } = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')
const Events = require('./lib/events')

class SocketServer extends StaticServer {
  constructor(acyort) {
    const {
      config,
      logger,
      fetcher,
      processor,
      generator,
    } = acyort

    super(config)

    this.base = pathFn.join(config.base, 'themes', config.theme)
    this.config = config
    this.logger = logger
    this.fetcher = fetcher
    this.processor = processor
    this.generator = generator
    this.events = new Events(config)

    this.clients = []
    this.port = undefined
    this.server = null
    this.ws = null
    this.watcher = null
    this.data = null
  }

  log() {
    const info = `Server running\n=> http://127.0.0.1:${this.port}/\nCTRL + C to shutdown`
    this.logger.info(info)
  }

  send(event) {
    this.clients.forEach((client) => {
      if (event === 'css') {
        client.send('css')
      } else {
        client.send('reload')
      }
    })
  }

  build(type) {
    if (this.data) {
      return this.generator.generate({ data: this.data, type })
    }

    return this.fetcher.fetch()
      .then(data => this.processor.process(data))
      .then((data) => {
        this.data = data
        return this.generator.generate({ data, type })
      })
  }

  start(port) {
    if (!this.data) {
      this.build('html')
    }

    this.port = port
    this.server = this.create(port)
    this.watcher = watch(this.base, { ignored: /(^|[/\\])\../, ignoreInitial: true })
    this.ws = new Server({ server: this.server })

    this.ws.on('connection', (client) => {
      client.on('close', () => {
        this.clients = this.clients.filter(c => c !== client)
      })
      this.clients.push(client)
    })

    this.watcher.on('all', (e, file) => {
      const event = this.events.type(file)

      if (file.indexOf(this.base) > -1) {
        this.logger.info(`${e} ${file}`)
      }

      if (event === 'css' || event === 'static') {
        this.generator.sources()
        this.send(event)
      }

      if (event !== '') {
        this.build(event).then(() => this.send('reload'))
      }
    })

    this.log()
  }
}

module.exports = SocketServer
