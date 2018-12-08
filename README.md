# acyort-server

AcyOrt LiveReload server plugin

## Install

```bash
$ npm i acyort-server -S
```

## Usage

add `acyort-server` to `config.yml`

```yml
# plugins, npm modules
plugins:
  - acyort-server
```

use

```bash
# default port 2222
$ acyort server [port]
```

get current server status

```js
// on AcyOrt workflow
module.exports = (acyort) => {
  acyort.workflow.register(function () {
    // store key is `server_status`
    console.log(acyort.store.get('server_statue'))
    /*
      {
        path: '...',
        event: '...'
      }
    */
  })
}
```

## Test

install AcyOrt

```bash
$ npm i acyort -g
```

test

```bash
$ cd test
$ acyort server [port]
```
