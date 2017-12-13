const Server = require('../')

const server = new Server(__dirname, {
  listen: 'listen',
  public: 'public'
})

server.action = ({ msg, e, path, clients }) => {
  if (msg) {
    return console.log(msg)
  }
  clients.forEach(client => client.send(`${e} ${path}`))
}

server.start()
