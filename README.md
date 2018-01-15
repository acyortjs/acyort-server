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

const watches = __dirname
const publics = __dirname

const server = new Server({
  watches,                    // watch files path
  publics,                    // public static files path
})

server.trigger = ({ e, path, clients }) => {
  console.log(e)              // file change event
  console.log(path)           // file path
  clients.forEach(client => client.send(path)) // send socket message to clients
}

// start server
server.start([port])          // default: 2222

// get status
console.log(server.status)    // { e, path }
```

## Cli

```bash
$ acyort-server [-p port]
```

