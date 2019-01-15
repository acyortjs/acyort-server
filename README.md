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

it will listen `templates` files change, and reload page or css

> get server status

```js
// on AcyOrt workflow
module.exports = (acyort) => {
  acyort.workflow.register(function () {
    console.log(acyort.store.get('status', 'acyort-server'))
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
