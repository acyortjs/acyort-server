# acyort-server

[![Build Status](https://travis-ci.org/acyortjs/acyort-server.svg?branch=master)](https://travis-ci.org/acyortjs/acyort-server)
[![codecov](https://codecov.io/gh/acyortjs/acyort-server/branch/master/graph/badge.svg)](https://codecov.io/gh/acyortjs/acyort-server)

Server for [AcyOrt](https://github.com/acyortjs/acyort)

## Install

```bash
$ npm i acyort-server -S

# cli
$ npm i acyort-server -g
```

## Usage

```js
const path = require('path')
const Server = require('acyort-server')

const server = new Server()

const watches = __dirname
const publics = __dirname

server.trigger = ({ e, path, clients }) => {
  console.log(e)            // file change event
  console.log(path)         // file path
  clients.forEach(client => client.send(path)) // send socket message to clients
}

// start server
server.start({
  [port: 2333]              // default: 2222
  watches,                  // watch files path
  publics,                  // public static files path
})

```

### cli

```bash
$ acyort-server [-p port]
```

