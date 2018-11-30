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
