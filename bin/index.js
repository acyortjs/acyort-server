#!/usr/bin/env node

const minimist = require('minimist')
const pathFn = require('path')
const Server = require('../')

const argv = minimist(process.argv.slice(2))
const port = argv.p || 2333

const server = new Server(process.cwd(), {
  listen: '/',
  public: '/'
})

server.addListener(({ e, path, clients }) => {
  console.log(path)
  const ext = pathFn.extname(path)
  const msg = ext === '.css' ? 'css' : 'html'
  clients.forEach(client => client.send(msg))
})

server.start(port)
