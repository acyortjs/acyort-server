# acyort-server

LiveReload Server for AcyOrt

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

```bash
# install AcyOrt
$ npm i acyort -g

# install packages
$ npm i

# start
$ npm start
```
