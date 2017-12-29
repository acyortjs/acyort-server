# acyort-server

[![Build Status](https://travis-ci.org/acyortjs/acyort-server.svg?branch=master)](https://travis-ci.org/acyortjs/acyort-server)
[![codecov](https://codecov.io/gh/acyortjs/acyort-server/branch/master/graph/badge.svg)](https://codecov.io/gh/acyortjs/acyort-server)

Server module for [AcyOrt](https://github.com/acyortjs/acyort)

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

const watchDir = __dirname
const publicDir = __dirname

server.init({
  watchDir,                 // watch files path
  publicDir,                // public static files path
})

function trigger({ e, path, clients }) => {
  console.log(e)            // file change event
  console.log(path)         // file path
  clients.forEach(client => client.send(path)) // send socket message to clients
}

// add trigger
server.addTrigger(trigger)

// start server
server.start([port])        // default 2222

// remove all triggers
server.removeTriggers()

```

### cli

```bash
$ acyort-server [-p port]
```

