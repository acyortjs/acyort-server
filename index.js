const { join, extname } = require('path')
const Pavane = require('pavane')

module.exports = (acyort) => {
  const { base, public: publicDir, template } = acyort.config
  const watches = join(base, 'templates', template)
  const publics = join(base, publicDir)
  const server = new Pavane(watches, publics)

  acyort.cli.register('commands', {
    name: 'server',
    fullName: 'server',
    description: 'LiveReload Server',
    action: async function action(argv) {
      const { _ = [] } = argv
      const p = Number(_[1]) || 2222

      server.subscribe = async (args) => {
        const {
          event,
          path,
          port,
          trigger,
          status,
        } = args

        if (status === 'start') {
          acyort.logger.log(`Server running: http://127.0.0.1:${port}\n  CTRL + C to shutdown`)
          return
        }

        if (event) {
          acyort.logger.info(`${event}: ${path.split(`${base}/templates/`)[1]}`)
          acyort.store.set('status', { event, path })

          try {
            await this.process()
          } catch (e) {
            acyort.logger.error(e)
            return
          }

          if (extname(path) === '.css') {
            trigger('css')
          } else {
            trigger('page')
          }
        }
      }

      acyort.store.set('status', { event: 'starting' })

      try {
        await this.process()
        server.start(p)
      } catch (e) {
        acyort.logger.error(e)
      }
    },
  })
}
