const fs = require('fs')
const path = require('path')
const http = require('http')
const assert = require('power-assert')
const sinon = require('sinon')
const Server = require('../')

const server = new Server(__dirname, {
  listen: 'listen',
  public: 'public'
})

server.action = ({ e, path, clients }) => {
  console.log(e)
  clients.forEach(client => client.send(path))
}

function sleep(t = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

function get(path = '/') {
  return new Promise(resolve => {
    http.get({
      host: '127.0.0.1',
      port: '2222',
      path
    }, (res) => {
      resolve(res.statusCode)
    })
  })
}

describe('server', () => {
  it('static server', async function() {
    server.start()

    let code = await get()
    assert(code === 200)

    code = await get('/text.txt')
    assert(code === 200)

    code = await get('/path')
    assert(code === 404)

    code = await get('/ss')
    assert(code === 404)

    server.close()
  })

  it('file', async function() {
    this.timeout(5000)

    const spy = sinon.spy(console, 'log')

    server.start()
    assert(spy.calledWith('Server running: http://127.0.0.1:2222/\nCTRL + C to shutdown') === true)

    await sleep(1000)

    fs.writeFileSync(path.join(__dirname, 'listen', 'index.js'), '// index.js')

    await sleep(1000)

    assert(spy.calledWith('change') === true)

    spy.restore()
    server.close()
  })
})
