const { join, extname } = require('path')
const Pavane = require('pavane')

const base = process.cwd()
const watches = join(base, 'templates')
const publics = base
const server = new Pavane(watches, publics)

module.exports = (acyort) => {
  acyort.cli.register('commands', {
    name: 'server',
    fullName: 'server',
    description: 'LiveReload Server',
    action: async function action(argv) {
      const { _ = [] } = argv
      const port = Number(_[1]) || 2222

      server.listener = async (args) => {
        const {
          event,
          path,
          message,
          reloadCss,
          reloadPage,
        } = args

        if (event === 'info') {
          this.logger.info(message)
          return
        }

        this.logger.info(`${event}: ${path.split(`${base}/templates/`)[1]}`)

        this.store.reset()
        this.store.set('server_status', { event, path })

        await this.process()

        if (extname(path) === '.css') {
          reloadCss()
        } else {
          reloadPage()
        }
      }

      await this.process()
      server.start(port)
    },
  })
}
