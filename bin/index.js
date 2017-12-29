#!/usr/bin/env node

const minimist = require('minimist')
const pathFn = require('path')
const Server = require('../')

const argv = minimist(process.argv.slice(2))
const port = argv.p || 2333
const cwd = process.cwd()
const watchDir = cwd
const publicDir = cwd
const server = new Server()

server.init({ watchDir, publicDir })

server.addTrigger(({ e, path, clients }) => {
  // eslint-disable-next-line no-console
  console.log(e, path)

  const ext = pathFn.extname(path)
  const msg = ext === '.css' ? 'css' : 'html'
  clients.forEach(client => client.send(msg))
})

server.start(port)
