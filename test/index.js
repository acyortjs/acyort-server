const fs = require('fs')
const path = require('path')
const http = require('http')
const puppeteer = require('puppeteer')
const assert = require('power-assert')
const sinon = require('sinon')
const Server = require('../')

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
    const spy = sinon.spy(console, 'log')

    const watches = path.join(__dirname, 'watches')
    const publics = path.join(__dirname, 'publics')
    const server = new Server({ watches, publics })

    server.trigger = ({ e, path, clients }) => {
      console.log(e)
    }

    server.start()
    assert(spy.calledWith('Server running: http://127.0.0.1:2222/\nCTRL + C to shutdown') === true)

    let code = await get()
    assert(code === 200)

    code = await get('/text.txt')
    assert(code === 200)

    code = await get('/path')
    assert(code === 404)

    code = await get('/ss')
    assert(code === 404)

    server.close()

    server.trigger = 'no a function'
    assert(server.callback() === null)

    spy.restore()
  })

  it('socket server', async function() {
    this.timeout(10000)

    const msgs = []

    const watches = path.join(__dirname, 'watches')
    const publics = path.join(__dirname, 'publics')
    const server = new Server({ watches, publics })

    server.trigger = ({ e, path, clients }) => {
      clients.forEach(client => client.send(path))
    }

    server.start()

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:2222')
    page.on('console', ({ text }) => msgs.push(text))

    await sleep(1000)

    fs.writeFileSync(path.join(__dirname, 'watches', 'index.html'), 'index.html')
    await sleep(1000)

    assert(msgs.length === 2)
    assert(msgs[1] === path.join(__dirname, 'watches', 'index.html'))

    await browser.close()
    server.close()
  })
})
